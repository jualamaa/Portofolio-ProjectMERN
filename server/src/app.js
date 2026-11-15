import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import healthRoutes from './routes/healthRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Trust proxy for Render / Railway deployment
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// Strict CORS configuration
const allowedOrigins = env.clientUrl.split(',').map((origin) => origin.trim());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS policy'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);

// Body parsers & cookie parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Prevent NoSQL query injection
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Request logging
if (!env.isProduction) {
    app.use(morgan('dev'));
}

// API v1 Routes
app.use('/api/v1/health', healthRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;