import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Skill name is required'],
            trim: true,
            maxlength: 60,
        },
        category: {
            type: String,
            required: [true, 'Skill category is required'],
            trim: true,
            default: 'General',
        },
        proficiency: {
            type: String,
            enum: ['Foundational', 'Intermediate', 'Proficient', 'Advanced'],
            default: 'Intermediate',
        },
        icon: {
            type: String,
            default: 'Code2',
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

skillSchema.index({ displayOrder: 1, name: 1 });

export const Skill = mongoose.model('Skill', skillSchema);