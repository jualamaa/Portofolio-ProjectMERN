import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req, res) => {
    const dbStateMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };

    const dbStatus = dbStateMap[mongoose.connection.readyState] || 'unknown';
    const isHealthy = mongoose.connection.readyState === 1;

    res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        service: 'JOSEPH.DEV API',
        version: 'v1',
        timestamp: new Date().toISOString(),
        database: {
            status: dbStatus,
            name: mongoose.connection.name || 'developer_portfolio',
        },
    });
});

export default router;