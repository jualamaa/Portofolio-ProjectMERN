import mongoose from 'mongoose';
import { generateSlug } from '../utils/slugify.js';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: 80,
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
        },
        type: {
            type: String,
            enum: ['project', 'certificate'],
            required: [true, 'Category type is required'],
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.index({ slug: 1, type: 1 }, { unique: true });

categorySchema.pre('validate', function (next) {
    if (this.name && (!this.slug || this.isModified('name'))) {
        this.slug = generateSlug(this.name);
    }
    next();
});

export const Category = mongoose.model('Category', categorySchema);