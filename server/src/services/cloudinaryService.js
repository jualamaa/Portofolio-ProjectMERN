import { Readable } from 'node:stream';
import { cloudinary } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const uploadBufferToCloudinary = (buffer, folder = 'portfolio/misc') => {
    if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
        return Promise.reject(
            new ApiError(500, 'Cloudinary credentials are not configured in server/.env.')
        );
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [{ quality: 'auto', fetch_format: 'auto', width: 1920, crop: 'limit' }],
            },
            (error, result) => {
                if (error) {
                    return reject(new ApiError(502, `Cloudinary upload failed: ${error.message}`));
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};

export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch (err) {
        console.error(`[Cloudinary Cleanup Warning] Failed to delete ${publicId}:`, err.message);
    }
};