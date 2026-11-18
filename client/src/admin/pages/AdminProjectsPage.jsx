import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import ConfirmDialog from '../components/ConfirmDialog';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../components/common/StateFeedback';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await adminService.getProjects();
            setProjects(list);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load projects.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await adminService.deleteProject(deleteTarget._id);
            setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete project.');
        } finally {
            setDeleting(false);
        }
    };

    const filtered = projects.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#242629]/15 pb-6">
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-1">
                        Portfolio Works
                    </p>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight">Project Management</h1>
                </div>

                <Link
                    to="/admin/projects/create"
                    className="inline-flex items-center gap-2 bg-[#17191C] text-[#F2F0EA] px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
                </Link>
            </div>

            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#242629]/50" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter projects..."
                    className="w-full bg-white/70 border border-[#242629]/20 pl-10 pr-4 py-2.5 text-sm"
                />
            </div>

            {loading ? (
                <LoadingSkeleton count={3} theme="light" />
            ) : error ? (
                <ErrorState message={error} onRetry={loadProjects} theme="light" />
            ) : filtered.length === 0 ? (
                <EmptyState
                    title="No projects found"
                    description="Create your first project case study to display it in your portfolio."
                    theme="light"
                />
            ) : (
                <div className="border border-[#242629]/20 bg-white/60 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#242629]/15 font-mono text-[11px] uppercase tracking-wider text-[#242629]/70">
                                <th className="p-4">Project</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Year</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#242629]/10 text-sm">
                            {filtered.map((project) => (
                                <tr key={project._id} className="hover:bg-black/[0.02]">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3.5">
                                            <img
                                                src={project.coverImage?.url}
                                                alt={project.title}
                                                className="w-14 h-10 object-cover border border-[#242629]/15 shrink-0"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{project.title}</span>
                                                    {project.featured && (
                                                        <Star className="w-3.5 h-3.5 fill-[#657568] text-[#657568]" />
                                                    )}
                                                </div>
                                                <p className="font-mono text-xs text-[#242629]/60">/{project.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-xs">{project.category?.name}</td>
                                    <td className="p-4 font-mono text-xs">{project.year}</td>
                                    <td className="p-4">
                                        <span
                                            className={`font-mono text-[11px] uppercase px-2.5 py-0.5 border ${project.status === 'published'
                                                    ? 'border-[#657568] text-[#657568]'
                                                    : 'border-[#242629]/30 text-[#242629]/60'
                                                }`}
                                        >
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/projects/edit/${project._id}`}
                                                className="p-2 border border-[#242629]/20 hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                                                title="Edit Project"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(project)}
                                                className="p-2 border border-red-600/30 text-red-700 hover:bg-red-700 hover:text-white transition-colors"
                                                title="Delete Project"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                title="Delete Project"
                message={`Delete "${deleteTarget?.title}" and permanently remove all associated Cloudinary images?`}
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}