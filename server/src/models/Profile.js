import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
    {
        institution: { type: String, required: true, trim: true },
        program: { type: String, required: true, trim: true },
        period: { type: String, required: true, trim: true },
        description: { type: String, default: '', trim: true },
    },
    { _id: true }
);

const learningJourneySchema = new mongoose.Schema(
    {
        year: { type: String, required: true, trim: true },
        topic: { type: String, required: true, trim: true },
        detail: { type: String, required: true, trim: true },
    },
    { _id: true }
);

const achievementSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        context: { type: String, required: true, trim: true },
        metric: { type: String, default: '', trim: true },
    },
    { _id: true }
);

const profileSchema = new mongoose.Schema(
    {
        brandName: { type: String, default: 'JOSEPH.DEV', trim: true },
        name: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        headline: { type: String, required: true, trim: true },
        shortIntro: { type: String, required: true, trim: true },
        bio: { type: String, required: true, trim: true },
        profileImage: {
            url: { type: String, default: '' },
            publicId: { type: String, default: '' },
        },
        location: { type: String, default: '', trim: true },
        availability: { type: String, default: 'Available for Projects', trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        education: [educationSchema],
        learningJourney: [learningJourneySchema],
        achievements: [achievementSchema],
        socialLinks: {
            github: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            instagram: { type: String, default: '' },
            website: { type: String, default: '' },
        },
    },
    {
        timestamps: true,
    }
);

export const Profile = mongoose.model('Profile', profileSchema);