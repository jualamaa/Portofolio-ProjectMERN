import { Router } from 'express';
import {
    getPublicProfile,
    getPublicProjects,
    getPublicProjectBySlug,
    getPublicCertificates,
    getPublicCategories,
    getPublicSkills,
} from '../controllers/publicController.js';

const router = Router();

router.get('/profile', getPublicProfile);
router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);
router.get('/certificates', getPublicCertificates);
router.get('/categories', getPublicCategories);
router.get('/skills', getPublicSkills);

export default router;