import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyCsrfHeader = (req, res, next) => {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
        return next();
    }

    const requestedWith = req.headers['x-requested-with'];
    if (!requestedWith || requestedWith !== 'XMLHttpRequest') {
        return next(new ApiError(403, 'Invalid or missing security header (CSRF check failed).'));
    }

    next();
};

export const protectAdmin = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.joseph_admin_token;

    if (!token) {
        throw new ApiError(401, 'Authentication required. Please log in.');
    }

    let decoded;
    try {
        decoded = jwt.verify(token, env.jwtSecret);
    } catch {
        throw new ApiError(401, 'Invalid or expired session token.');
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
        throw new ApiError(401, 'Administrator account not found or inactive.');
    }

    if (user.role !== 'admin') {
        throw new ApiError(403, 'Access denied. Administrator privileges required.');
    }

    req.user = user;
    next();
});