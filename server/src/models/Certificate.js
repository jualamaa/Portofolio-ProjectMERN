import mongoose from 'mongoose';
import { generateSlug } from '../utils/slugify.js';

const certificateSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Certificate title is required'],
            trim: true,
            maxlength: 160,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        issuer: {
            type: String,
            required: [true, 'Certificate issuer is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        image: {
            url: { type: String, required: [true, 'Certificate image URL is required'] },
            publicId: { type: String, default: '' },
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Certificate category is required'],
        },
        issuedAt: {
            type: Date,
            required: [true, 'Issue date is required'],
        },
        credentialId: {
            type: String,
            default: '',
            trim: true,
        },
        credentialUrl: {
            type: String,
            default: '',
            trim: true,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

certificateSchema.index({ displayOrder: 1, issuedAt: -1 });

certificateSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = generateSlug(this.title);
    }
    next();
});

export const Certificate = mongoose.model('Certificate', certificateSchema);