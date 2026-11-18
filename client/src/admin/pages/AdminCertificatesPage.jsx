import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import ConfirmDialog from '../components/ConfirmDialog';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../components/common/StateFeedback';

export default function AdminCertificatesPage() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadCertificates = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await adminService.getCertificates();
            setCertificates(list);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load certificates.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCertificates();
    }, [loadCertificates]);

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await adminService.deleteCertificate(deleteTarget._id);
            setCertificates((prev) => prev.filter((c) => c._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete certificate.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#242629]/15 pb-6">
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-1">
                        Accreditations
                    </p>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight">
                        Certificate Management
                    </h1>
                </div>

                <Link
                    to="/admin/certificates/create"
                    className="inline-flex items-center gap-2 bg-[#17191C] text-[#F2F0EA] px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Certificate</span>
                </Link>
            </div>

            {loading ? (
                <LoadingSkeleton count={3} theme="light" />
            ) : error ? (
                <ErrorState message={error} onRetry={loadCertificates} theme="light" />
            ) : certificates.length === 0 ? (
                <EmptyState
                    title="No certificates added yet"
                    description="Upload your technical certifications and training credentials."
                    theme="light"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <div
                            key={cert._id}
                            className="border border-[#242629]/20 bg-white/60 flex flex-col justify-between"
                        >
                            <div>
                                <img
                                    src={cert.image?.url}
                                    alt={cert.title}
                                    className="w-full h-44 object-cover border-b border-[#242629]/15"
                                />
                                <div className="p-5">
                                    <span className="font-mono text-[11px] text-[#657568]">{cert.category?.name}</span>
                                    <h3 className="font-display text-lg font-bold mt-1">{cert.title}</h3>
                                    <p className="text-xs text-[#242629]/75 mt-1">
                                        {cert.issuer} • {new Date(cert.issuedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="px-5 py-3 border-t border-[#242629]/15 flex items-center justify-end gap-2">
                                <Link
                                    to={`/admin/certificates/edit/${cert._id}`}
                                    className="p-2 border border-[#242629]/20 hover:bg-[#17191C] hover:text-[#F2F0EA]"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget(cert)}
                                    className="p-2 border border-red-600/30 text-red-700 hover:bg-red-700 hover:text-white"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                title="Delete Certificate"
                message={`Remove "${deleteTarget?.title}" and delete its image from Cloudinary?`}
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}