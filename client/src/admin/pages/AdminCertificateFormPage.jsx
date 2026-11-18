import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSkeleton } from '../../components/common/StateFeedback';

export default function AdminCertificateFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        issuer: '',
        description: '',
        category: '',
        issuedAt: '',
        credentialId: '',
        credentialUrl: '',
        displayOrder: 0,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const cats = await adminService.getCategories();
                const certCats = cats.filter((c) => c.type === 'certificate');
                setCategories(certCats);

                if (isEdit) {
                    const cert = await adminService.getCertificateById(id);
                    setForm({
                        title: cert.title || '',
                        issuer: cert.issuer || '',
                        description: cert.description || '',
                        category: cert.category?._id || cert.category || '',
                        issuedAt: cert.issuedAt ? new Date(cert.issuedAt).toISOString().slice(0, 10) : '',
                        credentialId: cert.credentialId || '',
                        credentialUrl: cert.credentialUrl || '',
                        displayOrder: cert.displayOrder || 0,
                    });
                    setImagePreview(cert.image?.url || '');
                } else if (certCats.length > 0) {
                    setForm((prev) => ({ ...prev, category: certCats[0]._id }));
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load certificate form.');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [id, isEdit]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isEdit && !imageFile) {
            setError('Certificate image file is required.');
            return;
        }

        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([key, val]) => fd.append(key, val));
            if (imageFile) fd.append('image', imageFile);

            if (isEdit) {
                await adminService.updateCertificate(id, fd);
            } else {
                await adminService.createCertificate(fd);
            }

            navigate('/admin/certificates');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save certificate.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSkeleton count={2} theme="light" />;

    return (
        <div className="max-w-3xl space-y-8">
            <div className="border-b border-[#242629]/15 pb-6">
                <Link
                    to="/admin/certificates"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#242629]/70 hover:text-[#657568] mb-3"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Certificates</span>
                </Link>
                <h1 className="font-display text-3xl font-extrabold tracking-tight">
                    {isEdit ? 'Edit Certificate' : 'Add New Certificate'}
                </h1>
            </div>

            {error && (
                <div className="p-4 border border-red-600/40 bg-red-50 text-red-700 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="border border-[#242629]/20 bg-white/50 p-6 sm:p-8 space-y-5">
                <div>
                    <label className="block font-mono text-xs uppercase mb-1.5">Certificate Title *</label>
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block font-mono text-xs uppercase mb-1.5">Issuing Organization *</label>
                        <input
                            type="text"
                            required
                            value={form.issuer}
                            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                            className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                        />
                    </div>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                        <label className="block font-mono text-xs uppercase mb-1.5">Issue Date *</label>
                        <input
                            type="date"
                            required
                            value={form.issuedAt}
                            onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
                            className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block font-mono text-xs uppercase mb-1.5">Credential ID</label>
                        <input
                            type="text"
                            value={form.credentialId}
                            onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                            className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm font-mono"
                        />
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

                <div>
                    <label className="block font-mono text-xs uppercase mb-1.5">Verification URL</label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={form.credentialUrl}
                        onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                        className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                    />
                </div>

                <div>
                    <label className="block font-mono text-xs uppercase mb-1.5">Description</label>
                    <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                    />
                </div>

                <div className="space-y-3 pt-2">
                    <label className="block font-mono text-xs uppercase">Certificate Image *</label>
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Certificate preview"
                            className="w-full max-w-md h-52 object-contain border border-[#242629]/20 bg-white"
                        />
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-2 border border-[#242629]/30 px-4 py-2.5 text-xs font-mono uppercase hover:bg-[#17191C] hover:text-[#F2F0EA]">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{imagePreview ? 'Replace Image' : 'Upload Certificate Image'}</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link
                        to="/admin/certificates"
                        className="border border-[#242629]/25 px-5 py-3 text-xs font-mono uppercase"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-[#17191C] text-[#F2F0EA] px-7 py-3 text-xs font-mono uppercase tracking-widest hover:bg-[#657568] disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Certificate'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}