import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitContactMessage } from '../controllers/contactController.js';

const router = Router();

const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, // Maksimal 5 pesan per 15 menit per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many messages sent from this IP. Please try again after 15 minutes.',
    },
});

router.post('/', contactRateLimiter, submitContactMessage);

export default router;