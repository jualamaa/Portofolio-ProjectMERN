import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
    await connectDB();

    const server = app.listen(env.port, () => {
        console.log(`[Server] JOSEPH.DEV running in ${env.nodeEnv} mode on port ${env.port}`);
    });

    process.on('unhandledRejection', (err) => {
        console.error('[Unhandled Rejection]', err.message);
        server.close(() => process.exit(1));
    });
};

startServer();