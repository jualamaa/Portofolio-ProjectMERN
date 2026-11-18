import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pencil, Check, X, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('project');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadCategories = useCallback(async () => {
        try {
            const list = await adminService.getCategories();
            setCategories(list);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load categories.');
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) return;
        try {
            const res = await adminService.createCategory({ name: name.trim(), type });
            setCategories((prev) => [...prev, res.data]);
            setName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create category.');
        }
    };

    const handleUpdate = async (id) => {
        setError('');
        try {
            const res = await adminService.updateCategory(id, { name: editName });
            setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
            setEditingId(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update category.');
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError('');
        try {
            await adminService.deleteCategory(deleteTarget._id);
            setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Cannot delete category in use.');
            setDeleteTarget(null);
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div className="border-b border-[#242629]/15 pb-6">
                <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-1">Taxonomy</p>
                <h1 className="font-display text-3xl font-extrabold tracking-tight">Category Management</h1>
            </div>

            {error && (
                <div className="p-4 border border-red-600/40 bg-red-50 text-red-700 text-sm flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* ADD FORM */}
            <form
                onSubmit={handleCreate}
                className="border border-[#242629]/20 bg-white/60 p-5 flex flex-col sm:flex-row gap-4"
            >
                <input
                    type="text"
                    required
                    placeholder="New category name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm font-mono"
                >
                    <option value="project">Project Category</option>
                    <option value="certificate">Certificate Category</option>
                </select>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-[#17191C] text-[#F2F0EA] px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#657568]"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                </button>
            </form>

            {/* LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['project', 'certificate'].map((groupType) => (
                    <div key={groupType} className="border border-[#242629]/20 bg-white/60 p-6">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568] border-b border-[#242629]/15 pb-3 mb-4">
                            {groupType === 'project' ? 'Project Categories' : 'Certificate Categories'}
                        </h2>
                        <div className="divide-y divide-[#242629]/10">
                            {categories
                                .filter((c) => c.type === groupType)
                                .map((cat) => (
                                    <div key={cat._id} className="py-3 flex items-center justify-between gap-2">
                                        {editingId === cat._id ? (
                                            <div className="flex-1 flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="flex-1 bg-white border border-[#242629]/30 px-2.5 py-1 text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdate(cat._id)}
                                                    className="p-1.5 bg-[#657568] text-white"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(null)}
                                                    className="p-1.5 border border-[#242629]/20"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <p className="text-sm font-medium">{cat.name}</p>
                                                    <p className="font-mono text-[11px] text-[#242629]/55">/{cat.slug}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingId(cat._id);
                                                            setEditName(cat.name);
                                                        }}
                                                        className="p-1.5 border border-[#242629]/20 hover:bg-[#17191C] hover:text-white"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(cat)}
                                                        className="p-1.5 border border-red-600/30 text-red-700 hover:bg-red-700 hover:text-white"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                title="Delete Category"
                message={`Delete category "${deleteTarget?.name}"? Categories actively used by projects or certificates are protected from deletion.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}