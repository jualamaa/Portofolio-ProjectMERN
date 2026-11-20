import crypto from 'node:crypto';
import { ContactMessage } from '../models/ContactMessage.js';
import { contactSchema } from '../validators/contactValidator.js';
import { sendContactNotificationEmail } from '../services/emailService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function hashIp(ip = '') {
    if (!ip) return '';
    return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export const submitContactMessage = asyncHandler(async (req, res) => {
    // 1. Honeypot check: bot mengisi field tersembunyi 'website'
    if (req.body.website && String(req.body.website).trim().length > 0) {
        return res.status(200).json({
            success: true,
            message: 'Thank you. Your message has been received.',
        });
    }

    // 2. Validasi payload dengan Zod
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.errors[0]?.message || 'Invalid contact form data.');
    }

    const { name, email, subject, message } = parsed.data;

    // 3. Simpan ke MongoDB
    const savedMessage = await ContactMessage.create({
        name,
        email,
        subject,
        message,
        status: 'unread',
        metadata: {
            ipHash: hashIp(req.ip),
            userAgent: (req.headers['user-agent'] || '').slice(0, 250),
        },
    });

    // 4. Kirim notifikasi SMTP ke administrator (non-blocking error jika SMTP gagal sementara)
    try {
        await sendContactNotificationEmail({ name, email, subject, message });
    } catch (mailErr) {
        console.error('[Contact SMTP Error]', mailErr.message);
    }

    res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully. I will respond shortly.',
        data: {
            id: savedMessage._id,
        },
    });
});