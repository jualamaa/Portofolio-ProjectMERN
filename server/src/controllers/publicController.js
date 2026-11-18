import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';
import { Certificate } from '../models/Certificate.js';
import { Category } from '../models/Category.js';
import { Skill } from '../models/Skill.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const getPublicProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne().lean();
    if (!profile) {
        throw new ApiError(404, 'Developer profile has not been initialized yet.');
    }

    res.json({
        success: true,
        data: profile,
    });
});

export const getPublicProjects = asyncHandler(async (req, res) => {
    const { search = '', category = '', featured = '', page = 1, limit = 20 } = req.query;

    const query = { status: 'published' };

    if (featured === 'true') {
        query.featured = true;
    }

    if (category && category !== 'all') {
        const catDoc = await Category.findOne({ slug: category, type: 'project' }).lean();
        if (catDoc) {
            query.category = catDoc._id;
        } else {
            return res.json({
                success: true,
                data: [],
                pagination: { total: 0, page: 1, pages: 1 },
            });
        }
    }

    if (search.trim()) {
        const safeRegex = new RegExp(escapeRegex(search.trim()), 'i');
        query.$or = [
            { title: safeRegex },
            { shortDescription: safeRegex },
            { technologies: safeRegex },
        ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
        Project.find(query)
            .populate('category', 'name slug')
            .sort({ featured: -1, displayOrder: 1, year: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Project.countDocuments(query),
    ]);

    res.json({
        success: true,
        data: projects,
        pagination: {
            total,
            page: pageNum,
            pages: Math.max(1, Math.ceil(total / limitNum)),
        },
    });
});

export const getPublicProjectBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const project = await Project.findOne({ slug, status: 'published' })
        .populate('category', 'name slug')
        .lean();

    if (!project) {
        throw new ApiError(404, 'Project case study not found.');
    }

    const allPublished = await Project.find({ status: 'published' })
        .select('title slug category')
        .populate('category', 'name slug')
        .sort({ featured: -1, displayOrder: 1, year: -1, createdAt: -1 })
        .lean();

    const currentIdx = allPublished.findIndex((p) => p.slug === slug);
    const prevProject = currentIdx > 0 ? allPublished[currentIdx - 1] : null;
    const nextProject =
        currentIdx >= 0 && currentIdx < allPublished.length - 1
            ? allPublished[currentIdx + 1]
            : null;

    const relatedProjects = await Project.find({
        status: 'published',
        _id: { $ne: project._id },
    })
        .select('title slug shortDescription category year')
        .populate('category', 'name slug')
        .limit(2)
        .lean();

    res.json({
        success: true,
        data: {
            project,
            prevProject,
            nextProject,
            relatedProjects,
        },
    });
});

export const getPublicCertificates = asyncHandler(async (req, res) => {
    const { search = '', category = '', year = '', page = 1, limit = 6 } = req.query;

    const query = {};

    if (category && category !== 'all') {
        const catDoc = await Category.findOne({ slug: category, type: 'certificate' }).lean();
        if (catDoc) {
            query.category = catDoc._id;
        } else {
            return res.json({
                success: true,
                data: [],
                availableYears: [],
                pagination: { total: 0, page: 1, pages: 1 },
            });
        }
    }

    if (year && year !== 'all') {
        const yr = parseInt(year, 10);
        if (!Number.isNaN(yr)) {
            query.issuedAt = {
                $gte: new Date(`${yr}-01-01T00:00:00.000Z`),
                $lte: new Date(`${yr}-12-31T23:59:59.999Z`),
            };
        }
    }

    if (search.trim()) {
        const safeRegex = new RegExp(escapeRegex(search.trim()), 'i');
        query.$or = [{ title: safeRegex }, { issuer: safeRegex }, { credentialId: safeRegex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 6));
    const skip = (pageNum - 1) * limitNum;

    const [certificates, total, allDates] = await Promise.all([
        Certificate.find(query)
            .populate('category', 'name slug')
            .sort({ displayOrder: 1, issuedAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Certificate.countDocuments(query),
        Certificate.find().select('issuedAt').lean(),
    ]);

    const availableYears = [
        ...new Set(allDates.map((d) => new Date(d.issuedAt).getFullYear().toString())),
    ].sort((a, b) => Number(b) - Number(a));

    res.json({
        success: true,
        data: certificates,
        availableYears,
        pagination: {
            total,
            page: pageNum,
            pages: Math.max(1, Math.ceil(total / limitNum)),
        },
    });
});

export const getPublicCategories = asyncHandler(async (req, res) => {
    const { type } = req.query;
    const query = {};
    if (type === 'project' || type === 'certificate') {
        query.type = type;
    }

    const categories = await Category.find(query).sort({ name: 1 }).lean();

    res.json({
        success: true,
        data: categories,
    });
});

export const getPublicSkills = asyncHandler(async (req, res) => {
    const skills = await Skill.find().sort({ displayOrder: 1, name: 1 }).lean();

    res.json({
        success: true,
        data: skills,
    });
});