import { z } from 'zod';

export const contactSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z
        .string({ required_error: 'Email address is required' })
        .trim()
        .toLowerCase()
        .email('Please provide a valid email address')
        .max(150, 'Email address is too long'),
    subject: z
        .string({ required_error: 'Subject is required' })
        .trim()
        .min(3, 'Subject must be at least 3 characters')
        .max(150, 'Subject must not exceed 150 characters'),
    message: z
        .string({ required_error: 'Message is required' })
        .trim()
        .min(10, 'Message must be at least 10 characters')
        .max(5000, 'Message must not exceed 5000 characters'),
    website: z.string().optional(), // Honeypot field
});

export function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}