import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

// Paksa Node.js menggunakan Google & Cloudflare DNS untuk SRV record MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);

        const conn = await mongoose.connect(env.mongodbUri, {
            dbName: 'developer_portfolio',
        });

        console.log(`[MongoDB] Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    } catch (error) {
        console.error(`[MongoDB] Connection Error: ${error.message}`);
        process.exit(1);
    }
};