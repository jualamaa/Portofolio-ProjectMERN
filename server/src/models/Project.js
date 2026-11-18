import mongoose from 'mongoose';
import { generateSlug } from '../utils/slugify.js';

const imageAssetSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        caption: { type: String, default: '' },
        order: { type: Number, default: 0 },
    },
    { _id: true }
);

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
            maxlength: 160,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        shortDescription: {
            type: String,
            required: [true, 'Short description is required'],
            trim: true,
            maxlength: 400,
        },
        overview: {
            type: String,
            required: [true, 'Project overview is required'],
            trim: true,
        },
        background: { type: String, default: '', trim: true },
        problem: { type: String, default: '', trim: true },
        solution: { type: String, default: '', trim: true },
        features: [{ type: String, trim: true }],
        technologies: [{ type: String, trim: true }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Project category is required'],
        },
        coverImage: {
            url: { type: String, required: [true, 'Cover image URL is required'] },
            publicId: { type: String, default: '' },
        },
        gallery: [imageAssetSchema],
        challenges: { type: String, default: '', trim: true },
        githubUrl: { type: String, default: '', trim: true },
        demoUrl: { type: String, default: '', trim: true },
        year: {
            type: Number,
            required: true,
            default: () => new Date().getFullYear(),
        },
        featured: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published',
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

projectSchema.index({ status: 1, featured: -1, displayOrder: 1, createdAt: -1 });

projectSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = generateSlug(this.title);
    }
    next();
});

export const Project = mongoose.model('Project', projectSchema);