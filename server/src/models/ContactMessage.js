import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Sender name is required'],
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, 'Sender email is required'],
            trim: true,
            lowercase: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            maxlength: 160,
        },
        message: {
            type: String,
            required: [true, 'Message body is required'],
            trim: true,
            maxlength: 5000,
        },
        status: {
            type: String,
            enum: ['unread', 'read', 'replied'],
            default: 'unread',
        },
    },
    {
        timestamps: true,
        collection: 'contact_messages',
    }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);