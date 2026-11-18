import { Router } from 'express';
import { protectAdmin, verifyCsrfHeader } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
    getDashboardStats,
    updateProfile,
    getAdminProjects,
    getAdminProjectById,
    createProject,
    updateProject,
    deleteProject,
    getAdminCertificates,
    getAdminCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAdminSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    getAdminMessages,
    getAdminMessageById,
    updateMessageStatus,
    deleteMessage,
} from '../controllers/adminController.js';

const router = Router();

router.use(protectAdmin);
router.use(verifyCsrfHeader);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Profile
router.put('/profile', upload.single('profileImage'), updateProfile);

// Projects
const projectUploadFields = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
]);
router.get('/projects', getAdminProjects);
router.get('/projects/:id', getAdminProjectById);
router.post('/projects', projectUploadFields, createProject);
router.put('/projects/:id', projectUploadFields, updateProject);
router.delete('/projects/:id', deleteProject);

// Certificates
router.get('/certificates', getAdminCertificates);
router.get('/certificates/:id', getAdminCertificateById);
router.post('/certificates', upload.single('image'), createCertificate);
router.put('/certificates/:id', upload.single('image'), updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

// Categories
router.get('/categories', getAdminCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Skills
router.get('/skills', getAdminSkills);
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Messages
router.get('/messages', getAdminMessages);
router.get('/messages/:id', getAdminMessageById);
router.patch('/messages/:id/status', updateMessageStatus);
router.delete('/messages/:id', deleteMessage);

export default router;