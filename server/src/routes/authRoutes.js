import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginAdmin, logoutAdmin, getAdminSession } from '../controllers/authController.js';
import { protectAdmin, verifyCsrfHeader } from '../middleware/authMiddleware.js';

const router = Router();

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.',
    },
});

router.post('/login', verifyCsrfHeader, loginRateLimiter, loginAdmin);
router.post('/logout', verifyCsrfHeader, logoutAdmin);
router.get('/me', protectAdmin, getAdminSession);

export default router;