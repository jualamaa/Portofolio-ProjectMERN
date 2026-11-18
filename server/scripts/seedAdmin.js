import mongoose from 'mongoose';
import '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

const seedAdminAccount = async () => {
    await connectDB();

    const name = process.env.ADMIN_SEED_NAME || 'Yoseph Admin';
    const email = (process.env.ADMIN_SEED_EMAIL || 'admin@joseph.dev').toLowerCase().trim();
    const password = process.env.ADMIN_SEED_PASSWORD;

    if (!password || password.length < 8) {
        console.error('[Seed Admin Error] ADMIN_SEED_PASSWORD in server/.env must be at least 8 characters.');
        process.exit(1);
    }

    let admin = await User.findOne({ email });

    if (admin) {
        admin.name = name;
        admin.password = password;
        admin.role = 'admin';
        admin.isActive = true;
        await admin.save();
        console.log(`[Seed Admin] Existing administrator updated: ${email}`);
    } else {
        admin = await User.create({
            name,
            email,
            password,
            role: 'admin',
            isActive: true,
        });
        console.log(`[Seed Admin] New administrator created: ${email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
};

seedAdminAccount().catch((err) => {
    console.error('[Seed Admin Error]', err);
    process.exit(1);
});