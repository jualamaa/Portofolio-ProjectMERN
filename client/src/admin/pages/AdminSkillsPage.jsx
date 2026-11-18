import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState([]);
    const [form, setForm] = useState({
        name: '',
        category: 'Frontend',
        proficiency: 'Intermediate',
        displayOrder: 0,
    });
    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadSkills = useCallback(async () => {
        const list = await adminService.getSkills();
        setSkills(list);
    }, []);

    useEffect(() => {
        loadSkills();
    }, [loadSkills]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        const res = await adminService.createSkill(form);
        setSkills((prev) => [...prev, res.data]);
        setForm({ name: '', category: form.category, proficiency: 'Intermediate', displayOrder: 0 });
    };

    const handleUpdateLevel = async (skill, proficiency) => {
        const res = await adminService.updateSkill(skill._id, { proficiency });
        setSkills((prev) => prev.map((s) => (s._id === skill._id ? res.data : s)));
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await adminService.deleteSkill(deleteTarget._id);
        setSkills((prev) => prev.filter((s) => s._id !== deleteTarget._id));
        setDeleteTarget(null);
    };

    return (
        <div className="max-w-5xl space-y-8">
            <div className="border-b border-[#242629]/15 pb-6">
                <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-1">
                    Capabilities
                </p>
                <h1 className="font-display text-3xl font-extrabold tracking-tight">Skills Management</h1>
            </div>

            {/* ADD SKILL */}
            <form
                onSubmit={handleAdd}
                className="border border-[#242629]/20 bg-white/60 p-5 grid grid-cols-1 sm:grid-cols-12 gap-3"
            >
                <input
                    type="text"
                    required
                    placeholder="Technology / Skill name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="sm:col-span-4 bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                />
                <input
                    type="text"
                    required
                    placeholder="Category (e.g. Frontend, Backend, IoT)"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="sm:col-span-3 bg-white border border-[#242629]/25 px-3.5 py-2.5 text-sm"
                />
                <select
                    value={form.proficiency}
                    onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
                    className="sm:col-span-2 bg-white border border-[#242629]/25 px-3 py-2.5 text-sm"
                >
                    <option value="Foundational">Foundational</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Advanced">Advanced</option>
                </select>
                <input
                    type="number"
                    placeholder="Order"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                    className="sm:col-span-1 bg-white border border-[#242629]/25 px-2.5 py-2.5 text-sm"
                />
                <button
                    type="submit"
                    className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 bg-[#17191C] text-[#F2F0EA] py-2.5 text-xs font-mono uppercase hover:bg-[#657568]"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                </button>
            </form>

            {/* TABLE */}
            <div className="border border-[#242629]/20 bg-white/60 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#242629]/15 font-mono text-[11px] uppercase tracking-wider text-[#242629]/70">
                            <th className="p-4">Skill</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Proficiency Level</th>
                            <th className="p-4">Order</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242629]/10 text-sm">
                        {skills.map((skill) => (
                            <tr key={skill._id}>
                                <td className="p-4 font-semibold">{skill.name}</td>
                                <td className="p-4 font-mono text-xs">{skill.category}</td>
                                <td className="p-4">
                                    <select
                                        value={skill.proficiency}
                                        onChange={(e) => handleUpdateLevel(skill, e.target.value)}
                                        className="bg-white border border-[#242629]/20 px-2.5 py-1 text-xs font-mono"
                                    >
                                        <option value="Foundational">Foundational</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Proficient">Proficient</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </td>
                                <td className="p-4 font-mono text-xs">{skill.displayOrder}</td>
                                <td className="p-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(skill)}
                                        className="p-2 border border-red-600/30 text-red-700 hover:bg-red-700 hover:text-white"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                title="Remove Skill"
                message={`Delete "${deleteTarget?.name}" from your portfolio capabilities?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}