import { useState, useEffect } from 'react';
import { Save, Eye, Plus, Trash2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { adminService } from '../../services/adminService';
import ModalLightbox from '../../components/ui/ModalLightbox';
import { LoadingSkeleton } from '../../components/common/StateFeedback';

export default function AdminProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [feedback, setFeedback] = useState({ type: null, text: '' });

    const [form, setForm] = useState({
        brandName: 'JOSEPH.DEV',
        name: '',
        title: '',
        headline: '',
        shortIntro: '',
        bio: '',
        location: '',
        availability: '',
        email: '',
        education: [],
        learningJourney: [],
        achievements: [],
        socialLinks: { github: '', linkedin: '', instagram: '', website: '' },
    });

    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    useEffect(() => {
        portfolioService
            .getProfile()
            .then((data) => {
                setForm({
                    brandName: data.brandName || 'JOSEPH.DEV',
                    name: data.name || '',
                    title: data.title || '',
                    headline: data.headline || '',
                    shortIntro: data.shortIntro || '',
                    bio: data.bio || '',
                    location: data.location || '',
                    availability: data.availability || '',
                    email: data.email || '',
                    education: data.education || [],
                    learningJourney: data.learningJourney || [],
                    achievements: data.achievements || [],
                    socialLinks: {
                        github: data.socialLinks?.github || '',
                        linkedin: data.socialLinks?.linkedin || '',
                        instagram: data.socialLinks?.instagram || '',
                        website: data.socialLinks?.website || '',
                    },
                });
                setCurrentImageUrl(data.profileImage?.url || '');
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const updateArrayItem = (key, idx, field, value) => {
        setForm((prev) => {
            const updated = [...prev[key]];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, [key]: updated };
        });
    };

    const addArrayItem = (key, emptyObj) => {
        setForm((prev) => ({ ...prev, [key]: [...prev[key], emptyObj] }));
    };

    const removeArrayItem = (key, idx) => {
        setForm((prev) => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFeedback({ type: null, text: '' });

        try {
            const fd = new FormData();
            fd.append('brandName', form.brandName);
            fd.append('name', form.name);
            fd.append('title', form.title);
            fd.append('headline', form.headline);
            fd.append('shortIntro', form.shortIntro);
            fd.append('bio', form.bio);
            fd.append('location', form.location);
            fd.append('availability', form.availability);
            fd.append('email', form.email);
            fd.append('education', JSON.stringify(form.education));
            fd.append('learningJourney', JSON.stringify(form.learningJourney));
            fd.append('achievements', JSON.stringify(form.achievements));
            fd.append('socialLinks', JSON.stringify(form.socialLinks));

            if (imageFile) {
                fd.append('profileImage', imageFile);
            }

            const res = await adminService.updateProfile(fd);
            if (res.data?.profileImage?.url) {
                setCurrentImageUrl(res.data.profileImage.url);
                setImageFile(null);
                setImagePreviewUrl('');
            }
            setFeedback({ type: 'success', text: 'Developer profile updated and published.' });
        } catch (err) {
            setFeedback({
                type: 'error',
                text: err.response?.data?.message || 'Failed to save profile changes.',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSkeleton count={2} theme="light" />;

    const activePortrait = imagePreviewUrl || currentImageUrl;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#242629]/15 pb-6">
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-1">
                        Identity & Biography
                    </p>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight">Profile Management</h1>
                </div>

                <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex items-center gap-2 border border-[#242629]/30 px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    <span>Preview Changes</span>
                </button>
            </div>

            {feedback.text && (
                <div
                    className={`p-4 border flex items-center gap-3 text-sm ${feedback.type === 'success'
                            ? 'border-[#657568] bg-[#657568]/15 text-[#242629]'
                            : 'border-red-600/40 bg-red-50 text-red-700'
                        }`}
                >
                    {feedback.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#657568] shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                    <span>{feedback.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* CORE IDENTITY & PHOTO */}
                <section className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-4">
                        <p className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            Profile Photograph
                        </p>
                        <div className="aspect-[4/5] border border-[#242629]/20 bg-[#EAE7DF] overflow-hidden">
                            {activePortrait ? (
                                <img src={activePortrait} alt="Profile preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#242629]/50">
                                    No Image
                                </div>
                            )}
                        </div>
                        <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full border border-[#242629]/30 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{imageFile ? 'Change Selected File' : 'Upload New Photo'}</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="lg:col-span-8 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1.5">Professional Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Hero Headline *</label>
                            <input
                                type="text"
                                required
                                value={form.headline}
                                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1.5">Location</label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1.5">Availability Status</label>
                                <input
                                    type="text"
                                    value={form.availability}
                                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                                    className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1.5">Public Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Hero Short Introduction *</label>
                            <textarea
                                rows={2}
                                required
                                value={form.shortIntro}
                                onChange={(e) => setForm({ ...form, shortIntro: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block font-mono text-xs uppercase mb-1.5">Full Biography *</label>
                            <textarea
                                rows={4}
                                required
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* SOCIAL LINKS */}
                <section className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 space-y-4">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                        Social & Developer Links
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {['github', 'linkedin', 'instagram', 'website'].map((net) => (
                            <div key={net}>
                                <label className="block font-mono text-xs uppercase mb-1">{net}</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={form.socialLinks[net] || ''}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            socialLinks: { ...form.socialLinks, [net]: e.target.value },
                                        })
                                    }
                                    className="w-full bg-white border border-[#242629]/25 px-3 py-2 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* EDUCATION */}
                <section className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            Education History
                        </h2>
                        <button
                            type="button"
                            onClick={() =>
                                addArrayItem('education', {
                                    institution: '',
                                    program: '',
                                    period: '',
                                    description: '',
                                })
                            }
                            className="inline-flex items-center gap-1.5 border border-[#242629]/25 px-3 py-1.5 text-xs font-mono uppercase hover:bg-[#17191C] hover:text-[#F2F0EA]"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Education</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {form.education.map((edu, idx) => (
                            <div key={idx} className="border border-[#242629]/15 bg-[#F2F0EA]/60 p-4 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Institution"
                                        value={edu.institution}
                                        onChange={(e) => updateArrayItem('education', idx, 'institution', e.target.value)}
                                        className="bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Program / Major"
                                        value={edu.program}
                                        onChange={(e) => updateArrayItem('education', idx, 'program', e.target.value)}
                                        className="bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Period (e.g. 2024 — 2027)"
                                            value={edu.period}
                                            onChange={(e) => updateArrayItem('education', idx, 'period', e.target.value)}
                                            className="flex-1 bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('education', idx)}
                                            className="p-2 border border-red-600/30 text-red-700 hover:bg-red-700 hover:text-white"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Brief description"
                                    value={edu.description}
                                    onChange={(e) => updateArrayItem('education', idx, 'description', e.target.value)}
                                    className="w-full bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* LEARNING JOURNEY */}
                <section className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            Learning Journey Timeline
                        </h2>
                        <button
                            type="button"
                            onClick={() =>
                                addArrayItem('learningJourney', { year: '2026', topic: '', detail: '' })
                            }
                            className="inline-flex items-center gap-1.5 border border-[#242629]/25 px-3 py-1.5 text-xs font-mono uppercase hover:bg-[#17191C] hover:text-[#F2F0EA]"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Milestone</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {form.learningJourney.map((step, idx) => (
                            <div key={idx} className="border border-[#242629]/15 bg-[#F2F0EA]/60 p-4 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Year"
                                        value={step.year}
                                        onChange={(e) => updateArrayItem('learningJourney', idx, 'year', e.target.value)}
                                        className="sm:col-span-2 bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Topic / Technology"
                                        value={step.topic}
                                        onChange={(e) => updateArrayItem('learningJourney', idx, 'topic', e.target.value)}
                                        className="sm:col-span-9 bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('learningJourney', idx)}
                                        className="sm:col-span-1 flex items-center justify-center p-2 border border-red-600/30 text-red-700 hover:bg-red-700 hover:text-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Details of what you built or explored"
                                    value={step.detail}
                                    onChange={(e) => updateArrayItem('learningJourney', idx, 'detail', e.target.value)}
                                    className="w-full bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ACHIEVEMENTS */}
                <section className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            Selected Achievements
                        </h2>
                        <button
                            type="button"
                            onClick={() => addArrayItem('achievements', { title: '', context: '', metric: '' })}
                            className="inline-flex items-center gap-1.5 border border-[#242629]/25 px-3 py-1.5 text-xs font-mono uppercase hover:bg-[#17191C] hover:text-[#F2F0EA]"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Achievement</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {form.achievements.map((ach, idx) => (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                <input
                                    type="text"
                                    placeholder="Achievement Title"
                                    value={ach.title}
                                    onChange={(e) => updateArrayItem('achievements', idx, 'title', e.target.value)}
                                    className="sm:col-span-4 bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Context / Event"
                                    value={ach.context}
                                    onChange={(e) => updateArrayItem('achievements', idx, 'context', e.target.value)}
                                    className="sm:col-span-4 bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Outcome / Metric"
                                    value={ach.metric}
                                    onChange={(e) => updateArrayItem('achievements', idx, 'metric', e.target.value)}
                                    className="sm:col-span-3 bg-white border border-[#242629]/20 px-3 py-2 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('achievements', idx)}
                                    className="sm:col-span-1 flex items-center justify-center p-2 border border-red-600/30 text-red-700 hover:bg-red-700 hover:text-white"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2.5 bg-[#17191C] text-[#F2F0EA] px-8 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest hover:bg-[#657568] transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                    </button>
                </div>
            </form>

            {/* PREVIEW MODAL */}
            <ModalLightbox
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title={form.name || 'Profile Preview'}
                subtitle={form.title}
            >
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {activePortrait && (
                            <img
                                src={activePortrait}
                                alt={form.name}
                                className="w-36 aspect-[4/5] object-cover border border-[#242629]/20"
                            />
                        )}
                        <div className="space-y-2">
                            <span className="font-mono text-xs text-[#657568]">{form.availability}</span>
                            <h4 className="font-display text-2xl font-bold">{form.headline}</h4>
                            <p className="text-sm text-[#242629]/80">{form.shortIntro}</p>
                        </div>
                    </div>
                    <div className="border-t border-[#242629]/15 pt-4">
                        <p className="font-mono text-xs uppercase text-[#657568] mb-2">Biography</p>
                        <p className="text-sm text-[#242629]/85 whitespace-pre-line">{form.bio}</p>
                    </div>
                </div>
            </ModalLightbox>
        </div>
    );
}