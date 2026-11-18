import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';
import { Certificate } from '../models/Certificate.js';
import { Category } from '../models/Category.js';
import { Skill } from '../models/Skill.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { generateSlug } from '../utils/slugify.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {
    uploadBufferToCloudinary,
    deleteFromCloudinary,
} from '../services/cloudinaryService.js';

function parseJsonField(raw, fallback) {
    if (raw === undefined || raw === null || raw === '') return fallback;
    if (typeof raw !== 'string') return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

/* ==================== DASHBOARD ==================== */
export const getDashboardStats = asyncHandler(async (req, res) => {
    const [
        totalProjects,
        totalCertificates,
        totalCategories,
        totalMessages,
        unreadMessages,
        recentProjects,
        recentCertificates,
        recentMessages,
    ] = await Promise.all([
        Project.countDocuments(),
        Certificate.countDocuments(),
        Category.countDocuments(),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ status: 'unread' }),
        Project.find()
            .populate('category', 'name')
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('title slug status featured year updatedAt category')
            .lean(),
        Certificate.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title issuer issuedAt category')
            .lean(),
        ContactMessage.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email subject status createdAt')
            .lean(),
    ]);

    res.json({
        success: true,
        data: {
            stats: {
                totalProjects,
                totalCertificates,
                totalCategories,
                totalMessages,
                unreadMessages,
            },
            recentProjects,
            recentCertificates,
            recentMessages,
        },
    });
});

/* ==================== PROFILE ==================== */
export const updateProfile = asyncHandler(async (req, res) => {
    let profile = await Profile.findOne();
    if (!profile) {
        profile = new Profile({
            name: req.body.name || 'Developer Name',
            title: req.body.title || 'Software Developer',
            headline: req.body.headline || 'Building Digital Solutions.',
            shortIntro: req.body.shortIntro || 'Developer portfolio.',
            bio: req.body.bio || 'Developer biography.',
            email: req.body.email || 'contact@joseph.dev',
        });
    }

    const updatableFields = [
        'brandName',
        'name',
        'title',
        'headline',
        'shortIntro',
        'bio',
        'location',
        'availability',
        'email',
    ];

    for (const field of updatableFields) {
        if (req.body[field] !== undefined) {
            profile[field] = req.body[field];
        }
    }

    if (req.body.education !== undefined) {
        profile.education = parseJsonField(req.body.education, profile.education);
    }
    if (req.body.learningJourney !== undefined) {
        profile.learningJourney = parseJsonField(req.body.learningJourney, profile.learningJourney);
    }
    if (req.body.achievements !== undefined) {
        profile.achievements = parseJsonField(req.body.achievements, profile.achievements);
    }
    if (req.body.socialLinks !== undefined) {
        profile.socialLinks = parseJsonField(req.body.socialLinks, profile.socialLinks);
    }

    const oldPublicId = profile.profileImage?.publicId;
    let newUploadedAsset = null;

    if (req.file) {
        newUploadedAsset = await uploadBufferToCloudinary(req.file.buffer, 'portfolio/profile');
        profile.profileImage = newUploadedAsset;
    }

    try {
        await profile.save();
    } catch (err) {
        if (newUploadedAsset?.publicId) {
            await deleteFromCloudinary(newUploadedAsset.publicId);
        }
        throw err;
    }

    if (newUploadedAsset && oldPublicId && oldPublicId !== newUploadedAsset.publicId) {
        await deleteFromCloudinary(oldPublicId);
    }

    res.json({
        success: true,
        message: 'Profile updated successfully.',
        data: profile,
    });
});

/* ==================== PROJECTS ==================== */
export const getAdminProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find()
        .populate('category', 'name slug')
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();

    res.json({ success: true, data: projects });
});

export const getAdminProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id).populate('category', 'name slug').lean();
    if (!project) throw new ApiError(404, 'Project not found.');
    res.json({ success: true, data: project });
});

export const createProject = asyncHandler(async (req, res) => {
    const coverFile = req.files?.coverImage?.[0];
    if (!coverFile) {
        throw new ApiError(400, 'Cover image file is required.');
    }

    const uploadedPublicIds = [];

    try {
        const coverAsset = await uploadBufferToCloudinary(coverFile.buffer, 'portfolio/projects');
        uploadedPublicIds.push(coverAsset.publicId);

        const galleryFiles = req.files?.galleryImages || [];
        const galleryCaptions = parseJsonField(req.body.galleryCaptions, []);
        const galleryAssets = [];

        for (let i = 0; i < galleryFiles.length; i++) {
            const uploaded = await uploadBufferToCloudinary(
                galleryFiles[i].buffer,
                'portfolio/projects'
            );
            uploadedPublicIds.push(uploaded.publicId);
            galleryAssets.push({
                url: uploaded.url,
                publicId: uploaded.publicId,
                caption: galleryCaptions[i] || '',
                order: i,
            });
        }

        const slug = req.body.slug?.trim()
            ? generateSlug(req.body.slug)
            : generateSlug(req.body.title || '');

        const project = await Project.create({
            title: req.body.title,
            slug,
            shortDescription: req.body.shortDescription,
            overview: req.body.overview,
            background: req.body.background || '',
            problem: req.body.problem || '',
            solution: req.body.solution || '',
            features: parseJsonField(req.body.features, []),
            technologies: parseJsonField(req.body.technologies, []),
            category: req.body.category,
            coverImage: coverAsset,
            gallery: galleryAssets,
            challenges: req.body.challenges || '',
            githubUrl: req.body.githubUrl || '',
            demoUrl: req.body.demoUrl || '',
            year: parseInt(req.body.year, 10) || new Date().getFullYear(),
            featured: req.body.featured === 'true' || req.body.featured === true,
            status: req.body.status === 'draft' ? 'draft' : 'published',
            displayOrder: parseInt(req.body.displayOrder, 10) || 0,
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully.',
            data: project,
        });
    } catch (err) {
        for (const pid of uploadedPublicIds) {
            await deleteFromCloudinary(pid);
        }
        throw err;
    }
});

export const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) throw new ApiError(404, 'Project not found.');

    const newlyUploadedIds = [];
    const publicIdsToDeleteAfterSave = [];

    try {
        // 1. Cover image replacement
        const coverFile = req.files?.coverImage?.[0];
        if (coverFile) {
            const newCover = await uploadBufferToCloudinary(coverFile.buffer, 'portfolio/projects');
            newlyUploadedIds.push(newCover.publicId);
            if (project.coverImage?.publicId) {
                publicIdsToDeleteAfterSave.push(project.coverImage.publicId);
            }
            project.coverImage = newCover;
        }

        // 2. Existing gallery filtering, reordering, and caption updates
        const retainedGallery = parseJsonField(req.body.existingGallery, null);
        if (Array.isArray(retainedGallery)) {
            const retainedPublicIds = new Set(retainedGallery.map((g) => g.publicId).filter(Boolean));
            for (const oldImg of project.gallery) {
                if (oldImg.publicId && !retainedPublicIds.has(oldImg.publicId)) {
                    publicIdsToDeleteAfterSave.push(oldImg.publicId);
                }
            }
            project.gallery = retainedGallery.map((item, idx) => ({
                url: item.url,
                publicId: item.publicId || '',
                caption: item.caption || '',
                order: idx,
            }));
        }

        // 3. Append newly uploaded gallery images
        const newGalleryFiles = req.files?.galleryImages || [];
        const newGalleryCaptions = parseJsonField(req.body.newGalleryCaptions, []);
        for (let i = 0; i < newGalleryFiles.length; i++) {
            const uploaded = await uploadBufferToCloudinary(
                newGalleryFiles[i].buffer,
                'portfolio/projects'
            );
            newlyUploadedIds.push(uploaded.publicId);
            project.gallery.push({
                url: uploaded.url,
                publicId: uploaded.publicId,
                caption: newGalleryCaptions[i] || '',
                order: project.gallery.length,
            });
        }

        // 4. Scalar & array fields
        const scalarFields = [
            'title',
            'shortDescription',
            'overview',
            'background',
            'problem',
            'solution',
            'category',
            'challenges',
            'githubUrl',
            'demoUrl',
        ];
        for (const field of scalarFields) {
            if (req.body[field] !== undefined) project[field] = req.body[field];
        }

        if (req.body.slug !== undefined && req.body.slug.trim()) {
            project.slug = generateSlug(req.body.slug);
        }
        if (req.body.features !== undefined) {
            project.features = parseJsonField(req.body.features, project.features);
        }
        if (req.body.technologies !== undefined) {
            project.technologies = parseJsonField(req.body.technologies, project.technologies);
        }
        if (req.body.year !== undefined) {
            project.year = parseInt(req.body.year, 10) || project.year;
        }
        if (req.body.featured !== undefined) {
            project.featured = req.body.featured === 'true' || req.body.featured === true;
        }
        if (req.body.status !== undefined) {
            project.status = req.body.status === 'draft' ? 'draft' : 'published';
        }
        if (req.body.displayOrder !== undefined) {
            project.displayOrder = parseInt(req.body.displayOrder, 10) || 0;
        }

        await project.save();

        for (const pid of publicIdsToDeleteAfterSave) {
            await deleteFromCloudinary(pid);
        }

        res.json({
            success: true,
            message: 'Project updated successfully.',
            data: project,
        });
    } catch (err) {
        for (const pid of newlyUploadedIds) {
            await deleteFromCloudinary(pid);
        }
        throw err;
    }
});

export const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) throw new ApiError(404, 'Project not found.');

    const publicIds = [];
    if (project.coverImage?.publicId) publicIds.push(project.coverImage.publicId);
    for (const img of project.gallery || []) {
        if (img.publicId) publicIds.push(img.publicId);
    }

    await project.deleteOne();

    for (const pid of publicIds) {
        await deleteFromCloudinary(pid);
    }

    res.json({ success: true, message: 'Project deleted successfully.' });
});

/* ==================== CERTIFICATES ==================== */
export const getAdminCertificates = asyncHandler(async (req, res) => {
    const certificates = await Certificate.find()
        .populate('category', 'name slug')
        .sort({ displayOrder: 1, issuedAt: -1 })
        .lean();

    res.json({ success: true, data: certificates });
});

export const getAdminCertificateById = asyncHandler(async (req, res) => {
    const certificate = await Certificate.findById(req.params.id)
        .populate('category', 'name slug')
        .lean();
    if (!certificate) throw new ApiError(404, 'Certificate not found.');
    res.json({ success: true, data: certificate });
});

export const createCertificate = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'Certificate image file is required.');
    }

    const uploadedAsset = await uploadBufferToCloudinary(
        req.file.buffer,
        'portfolio/certificates'
    );

    try {
        const slug = req.body.slug?.trim()
            ? generateSlug(req.body.slug)
            : generateSlug(req.body.title || '');

        const certificate = await Certificate.create({
            title: req.body.title,
            slug,
            issuer: req.body.issuer,
            description: req.body.description || '',
            image: uploadedAsset,
            category: req.body.category,
            issuedAt: req.body.issuedAt,
            credentialId: req.body.credentialId || '',
            credentialUrl: req.body.credentialUrl || '',
            displayOrder: parseInt(req.body.displayOrder, 10) || 0,
        });

        res.status(201).json({
            success: true,
            message: 'Certificate added successfully.',
            data: certificate,
        });
    } catch (err) {
        await deleteFromCloudinary(uploadedAsset.publicId);
        throw err;
    }
});

export const updateCertificate = asyncHandler(async (req, res) => {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) throw new ApiError(404, 'Certificate not found.');

    let newAsset = null;
    const oldPublicId = certificate.image?.publicId;

    try {
        if (req.file) {
            newAsset = await uploadBufferToCloudinary(req.file.buffer, 'portfolio/certificates');
            certificate.image = newAsset;
        }

        const fields = ['title', 'issuer', 'description', 'category', 'credentialId', 'credentialUrl'];
        for (const f of fields) {
            if (req.body[f] !== undefined) certificate[f] = req.body[f];
        }

        if (req.body.slug !== undefined && req.body.slug.trim()) {
            certificate.slug = generateSlug(req.body.slug);
        }
        if (req.body.issuedAt !== undefined) {
            certificate.issuedAt = req.body.issuedAt;
        }
        if (req.body.displayOrder !== undefined) {
            certificate.displayOrder = parseInt(req.body.displayOrder, 10) || 0;
        }

        await certificate.save();

        if (newAsset && oldPublicId && oldPublicId !== newAsset.publicId) {
            await deleteFromCloudinary(oldPublicId);
        }

        res.json({
            success: true,
            message: 'Certificate updated successfully.',
            data: certificate,
        });
    } catch (err) {
        if (newAsset?.publicId) {
            await deleteFromCloudinary(newAsset.publicId);
        }
        throw err;
    }
});

export const deleteCertificate = asyncHandler(async (req, res) => {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) throw new ApiError(404, 'Certificate not found.');

    const publicId = certificate.image?.publicId;
    await certificate.deleteOne();

    if (publicId) {
        await deleteFromCloudinary(publicId);
    }

    res.json({ success: true, message: 'Certificate deleted successfully.' });
});

/* ==================== CATEGORIES ==================== */
export const getAdminCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ type: 1, name: 1 }).lean();
    res.json({ success: true, data: categories });
});

export const createCategory = asyncHandler(async (req, res) => {
    const { name, type, description = '' } = req.body;
    if (!name?.trim() || !['project', 'certificate'].includes(type)) {
        throw new ApiError(400, 'Valid category name and type (project or certificate) are required.');
    }

    const category = await Category.create({
        name: name.trim(),
        slug: generateSlug(name),
        type,
        description: description.trim(),
    });

    res.status(201).json({
        success: true,
        message: 'Category created successfully.',
        data: category,
    });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found.');

    if (req.body.name?.trim()) {
        category.name = req.body.name.trim();
        category.slug = generateSlug(req.body.name);
    }
    if (req.body.description !== undefined) {
        category.description = req.body.description.trim();
    }

    await category.save();
    res.json({ success: true, message: 'Category updated.', data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found.');

    const [inProjects, inCertificates] = await Promise.all([
        Project.countDocuments({ category: category._id }),
        Certificate.countDocuments({ category: category._id }),
    ]);

    if (inProjects > 0 || inCertificates > 0) {
        throw new ApiError(
            409,
            `Cannot delete category '${category.name}' because it is currently assigned to ${inProjects + inCertificates
            } item(s). Reassign those items first.`
        );
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted.' });
});

/* ==================== SKILLS ==================== */
export const getAdminSkills = asyncHandler(async (req, res) => {
    const skills = await Skill.find().sort({ displayOrder: 1, name: 1 }).lean();
    res.json({ success: true, data: skills });
});

export const createSkill = asyncHandler(async (req, res) => {
    const { name, category, proficiency = 'Intermediate', icon = 'Code2', displayOrder = 0 } = req.body;
    if (!name?.trim() || !category?.trim()) {
        throw new ApiError(400, 'Skill name and category are required.');
    }

    const skill = await Skill.create({
        name: name.trim(),
        category: category.trim(),
        proficiency,
        icon,
        displayOrder: parseInt(displayOrder, 10) || 0,
    });

    res.status(201).json({ success: true, message: 'Skill added.', data: skill });
});

export const updateSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw new ApiError(404, 'Skill not found.');

    if (req.body.name?.trim()) skill.name = req.body.name.trim();
    if (req.body.category?.trim()) skill.category = req.body.category.trim();
    if (req.body.proficiency) skill.proficiency = req.body.proficiency;
    if (req.body.icon !== undefined) skill.icon = req.body.icon;
    if (req.body.displayOrder !== undefined) {
        skill.displayOrder = parseInt(req.body.displayOrder, 10) || 0;
    }

    await skill.save();
    res.json({ success: true, message: 'Skill updated.', data: skill });
});

export const deleteSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw new ApiError(404, 'Skill not found.');

    await skill.deleteOne();
    res.json({ success: true, message: 'Skill deleted.' });
});

/* ==================== CONTACT MESSAGES ==================== */
export const getAdminMessages = asyncHandler(async (req, res) => {
    const { status = 'all' } = req.query;
    const query = {};
    if (['unread', 'read', 'replied'].includes(status)) {
        query.status = status;
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: messages });
});

export const getAdminMessageById = asyncHandler(async (req, res) => {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) throw new ApiError(404, 'Message not found.');

    if (message.status === 'unread') {
        message.status = 'read';
        await message.save();
    }

    res.json({ success: true, data: message });
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['unread', 'read', 'replied'].includes(status)) {
        throw new ApiError(400, 'Invalid message status.');
    }

    const message = await ContactMessage.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );
    if (!message) throw new ApiError(404, 'Message not found.');

    res.json({ success: true, message: 'Message status updated.', data: message });
});

export const deleteMessage = asyncHandler(async (req, res) => {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) throw new ApiError(404, 'Message not found.');

    await message.deleteOne();
    res.json({ success: true, message: 'Message deleted.' });
});