import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { loginSchema } from '../validators/authValidator.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const COOKIE_NAME = 'joseph_admin_token';

function getCookieOptions() {
    return {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
        path: '/',
    };
}

export const loginAdmin = asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.errors[0]?.message || 'Invalid login credentials format.');
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn,
    });

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.json({
        success: true,
        message: 'Authenticated successfully.',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
        },
    });
});

export const logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? 'none' : 'lax',
        path: '/',
    });

    res.json({
        success: true,
        message: 'Logged out successfully.',
    });
});

export const getAdminSession = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        data: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            lastLogin: req.user.lastLogin,
        },
    });
});