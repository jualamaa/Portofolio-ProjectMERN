import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSkeleton } from '../../components/common/StateFeedback';

export default function AdminProjectFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        slug: '',
        shortDescription: '',
        overview: '',
        background: '',
        problem: '',
        solution: '',
        challenges: '',
        category: '',
        year: new Date().getFullYear(),
        githubUrl: '',
        demoUrl: '',
        featured: false,
        status: 'published',
        displayOrder: 0,
        features: [''],
        technologies: [''],
    });

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState('');

    // Existing gallery images (from DB) & new gallery files (pending upload)
    const [existingGallery, setExistingGallery] = useState([]);
    const [newGalleryItems, setNewGalleryItems] = useState([]); // [{ file, previewUrl, caption }]

    useEffect(() => {
        const init = async () => {
            try {
                const cats = await adminService.getCategories();
                const projectCats = cats.filter((c) => c.type === 'project');
                setCategories(projectCats);

                if (isEdit) {
                    const proj = await adminService.getProjectById(id);
                    setForm({
                        title: proj.title || '',
                        slug: proj.slug || '',
                        shortDescription: proj.shortDescription || '',
                        overview: proj.overview || '',
                        background: proj.background || '',
                        problem: proj.problem || '',
                        solution: proj.solution || '',
                        challenges: proj.challenges || '',
                        category: proj.category?._id || proj.category || '',
                        year: proj.year || new Date().getFullYear(),
                        githubUrl: proj.githubUrl || '',
                        demoUrl: proj.demoUrl || '',
                        featured: Boolean(proj.featured),
                        status: proj.status || 'published',
                        displayOrder: proj.displayOrder || 0,
                        features: proj.features?.length ? proj.features : [''],
                        technologies: proj.technologies?.length ? proj.technologies : [''],
                    });
                    setCoverPreview(proj.coverImage?.url || '');
                    setExistingGallery(proj.gallery || []);
                } else if (projectCats.length > 0) {
                    setForm((prev) => ({ ...prev, category: projectCats[0]._id }));
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load form data.');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [id, isEdit]);

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleNewGalleryFiles = (e) => {
        const files = Array.from(e.target.files || []);
        const mapped = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            caption: '',
        }));
        setNewGalleryItems((prev) => [...prev, ...mapped]);
    };

    const moveExistingGallery = (idx, direction) => {
        const targetIdx = idx + direction;
        if (targetIdx < 0 || targetIdx >= existingGallery.length) return;
        const copy = [...existingGallery];
        [copy[idx], copy[targetIdx]] = [copy[targetIdx], copy[idx]];
        setExistingGallery(copy);
    };

    const updateListField = (key, idx, val) => {
        setForm((prev) => {
            const next = [...prev[key]];
            next[idx] = val;
            return { ...prev, [key]: next };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isEdit && !coverFile) {
            setError('Cover image is required when creating a new project.');
            return;
        }

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            if (form.slug.trim()) fd.append('slug', form.slug.trim());
            fd.append('shortDescription', form.shortDescription);
            fd.append('overview', form.overview);
            fd.append('background', form.background);
            fd.append('problem', form.problem);
            fd.append('solution', form.solution);
            fd.append('challenges', form.challenges);
            fd.append('category', form.category);
            fd.append('year', form.year);
            fd.append('githubUrl', form.githubUrl);
            fd.append('demoUrl', form.demoUrl);
            fd.append('featured', form.featured);
            fd.append('status', form.status);
            fd.append('displayOrder', form.displayOrder);
            fd.append(
                'features',
                JSON.stringify(form.features.map((f) => f.trim()).filter(Boolean))
            );
            fd.append(
                'technologies',
                JSON.stringify(form.technologies.map((t) => t.trim()).filter(Boolean))
            );

            if (coverFile) {
                fd.append('coverImage', coverFile);
            }

            if (isEdit) {
                fd.append('existingGallery', JSON.stringify(existingGallery));
                fd.append(
                    'newGalleryCaptions',
                    JSON.stringify(newGalleryItems.map((item) => item.caption))
                );
            } else {
                fd.append(
                    'galleryCaptions',
                    JSON.stringify(newGalleryItems.map((item) => item.caption))
                );
            }

            for (const item of newGalleryItems) {
                fd.append('galleryImages', item.file);
            }

            if (isEdit) {
                await adminService.updateProject(id, fd);
            } else {
                await adminService.createProject(fd);
            }

            navigate('/admin/projects');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save project.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSkeleton count={2} theme="light" />;

    return (
        <div className="space-y-8">
            <div className="border-b border-[#242629]/15 pb-6">
                <Link
                    to="/admin/projects"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#242629]/70 hover:text-[#657568] mb-3"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Projects</span>
                </Link>
                <h1 className="font-display text-3xl font-extrabold tracking-tight">
                    {isEdit ? 'Edit Project Case Study' : 'Create New Project'}
                </h1>
            </div>

            {error && (
                <div className="p-4 border border-red-600/40 bg-red-50 text-red-700 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* BASIC INFO */}
                <section className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 space-y-5">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                        01 / Project Metadata
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Project Title *</label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">
                                Custom Slug (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="auto-generated-from-title"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Category *</label>
                            <select
                                required
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Year *</label>
                            <input
                                type="number"
                                required
                                value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Display Order</label>
                            <input
                                type="number"
                                value={form.displayOrder}
                                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <input
                            id="featured-checkbox"
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                            className="w-4 h-4 accent-[#657568]"
                        />
                        <label htmlFor="featured-checkbox" className="text-sm font-medium">
                            Feature this project on the Home Page
                        </label>
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase mb-1.5">Short Summary *</label>
                        <textarea
                            rows={2}
                            required
                            value={form.shortDescription}
                            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                            className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">GitHub Repository URL</label>
                            <input
                                type="url"
                                placeholder="https://github.com/..."
                                value={form.githubUrl}
                                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Live Demo URL</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={form.demoUrl}
                                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* CASE STUDY NARRATIVE */}
                <section className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 space-y-5">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                        02 / Case Study Architecture
                    </h2>

                    <div>
                        <label className="block font-mono text-xs uppercase mb-1.5">Project Overview *</label>
                        <textarea
                            rows={3}
                            required
                            value={form.overview}
                            onChange={(e) => setForm({ ...form, overview: e.target.value })}
                            className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Background</label>
                            <textarea
                                rows={4}
                                value={form.background}
                                onChange={(e) => setForm({ ...form, background: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Problem Statement</label>
                            <textarea
                                rows={4}
                                value={form.problem}
                                onChange={(e) => setForm({ ...form, problem: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Engineered Solution</label>
                            <textarea
                                rows={4}
                                value={form.solution}
                                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase mb-1.5">
                            Technical Challenges & Resolutions
                        </label>
                        <textarea
                            rows={3}
                            value={form.challenges}
                            onChange={(e) => setForm({ ...form, challenges: e.target.value })}
                            className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                        />
                    </div>

                    {/* Features & Technologies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="font-mono text-xs uppercase">Main Features</label>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, features: [...form.features, ''] })}
                                    className="text-xs font-mono underline flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add Feature
                                </button>
                            </div>
                            {form.features.map((feat, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feat}
                                        onChange={(e) => updateListField('features', idx, e.target.value)}
                                        placeholder="e.g. Real-time WebSocket updates"
                                        className="flex-1 bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                features: form.features.filter((_, i) => i !== idx),
                                            })
                                        }
                                        className="p-2 border border-red-600/30 text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="font-mono text-xs uppercase">Technology Stack</label>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, technologies: [...form.technologies, ''] })}
                                    className="text-xs font-mono underline flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add Tech
                                </button>
                            </div>
                            {form.technologies.map((tech, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tech}
                                        onChange={(e) => updateListField('technologies', idx, e.target.value)}
                                        placeholder="e.g. React.js, Node.js, MongoDB"
                                        className="flex-1 bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                technologies: form.technologies.filter((_, i) => i !== idx),
                                            })
                                        }
                                        className="p-2 border border-red-600/30 text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* MEDIA & SCREENSHOTS GALLERY */}
                <section className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 space-y-6">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                        03 / Visual Assets (Cloudinary)
                    </h2>

                    {/* Cover Image */}
                    <div className="space-y-3">
                        <label className="block font-mono text-xs uppercase">Cover Image *</label>
                        {coverPreview && (
                            <img
                                src={coverPreview}
                                alt="Cover preview"
                                className="w-full max-w-lg h-56 object-cover border border-[#242629]/20"
                            />
                        )}
                        <label className="cursor-pointer inline-flex items-center gap-2 border border-[#242629]/30 px-4 py-2.5 text-xs font-mono uppercase hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{coverPreview ? 'Replace Cover Image' : 'Select Cover Image'}</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleCoverChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Existing Gallery (Edit Mode) */}
                    {existingGallery.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-[#242629]/15">
                            <p className="font-mono text-xs uppercase">Saved Screenshots (Reorder or Remove)</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {existingGallery.map((item, idx) => (
                                    <div key={item.publicId || idx} className="border border-[#242629]/20 p-3 bg-white space-y-2">
                                        <img src={item.url} alt="" className="w-full h-40 object-cover" />
                                        <input
                                            type="text"
                                            placeholder="Screenshot caption"
                                            value={item.caption || ''}
                                            onChange={(e) => {
                                                const copy = [...existingGallery];
                                                copy[idx] = { ...copy[idx], caption: e.target.value };
                                                setExistingGallery(copy);
                                            }}
                                            className="w-full border border-[#242629]/20 px-2.5 py-1.5 text-xs"
                                        />
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveExistingGallery(idx, -1)}
                                                    className="p-1.5 border border-[#242629]/20"
                                                >
                                                    <ArrowUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveExistingGallery(idx, 1)}
                                                    className="p-1.5 border border-[#242629]/20"
                                                >
                                                    <ArrowDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExistingGallery(existingGallery.filter((_, i) => i !== idx))
                                                }
                                                className="px-2.5 py-1 border border-red-600/30 text-red-700 text-xs font-mono"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Gallery Uploads */}
                    <div className="space-y-3 pt-4 border-t border-[#242629]/15">
                        <label className="block font-mono text-xs uppercase">Add Project Screenshots</label>
                        <label className="cursor-pointer inline-flex items-center gap-2 border border-[#242629]/30 px-4 py-2.5 text-xs font-mono uppercase hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Select Multiple Screenshots</span>
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleNewGalleryFiles}
                                className="hidden"
                            />
                        </label>

                        {newGalleryItems.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                {newGalleryItems.map((item, idx) => (
                                    <div key={idx} className="border border-[#242629]/20 p-3 bg-white space-y-2">
                                        <img src={item.previewUrl} alt="" className="w-full h-40 object-cover" />
                                        <input
                                            type="text"
                                            placeholder="Caption for this screenshot..."
                                            value={item.caption}
                                            onChange={(e) => {
                                                const copy = [...newGalleryItems];
                                                copy[idx] = { ...copy[idx], caption: e.target.value };
                                                setNewGalleryItems(copy);
                                            }}
                                            className="w-full border border-[#242629]/20 px-2.5 py-1.5 text-xs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNewGalleryItems(newGalleryItems.filter((_, i) => i !== idx))
                                            }
                                            className="px-2.5 py-1 border border-red-600/30 text-red-700 text-xs font-mono"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <div className="flex justify-end gap-4">
                    <Link
                        to="/admin/projects"
                        className="border border-[#242629]/25 px-6 py-3.5 text-xs font-mono uppercase tracking-widest"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-[#17191C] text-[#F2F0EA] px-8 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest hover:bg-[#657568] transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Uploading & Saving...' : 'Save Project'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}