import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    FolderKanban,
    Award,
    Tags,
    Mail,
    MailWarning,
    Plus,
    ArrowUpRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSkeleton, ErrorState } from '../../components/common/StateFeedback';

export default function AdminDashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.getDashboard();
            setData(res);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) return <LoadingSkeleton count={3} theme="light" />;
    if (error) return <ErrorState message={error} onRetry={loadDashboard} theme="light" />;

    const { stats, recentProjects, recentCertificates, recentMessages } = data;

    const statCards = [
        { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, link: '/admin/projects' },
        { label: 'Certificates', value: stats.totalCertificates, icon: Award, link: '/admin/certificates' },
        { label: 'Categories', value: stats.totalCategories, icon: Tags, link: '/admin/categories' },
        { label: 'Total Messages', value: stats.totalMessages, icon: Mail, link: '/admin/messages' },
        { label: 'Unread Inbox', value: stats.unreadMessages, icon: MailWarning, link: '/admin/messages', highlight: stats.unreadMessages > 0 },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#242629]/15 pb-6">
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-1">
                        Overview
                    </p>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight">
                        System & Content Metrics
                    </h1>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/admin/projects/create"
                        className="inline-flex items-center gap-2 bg-[#17191C] text-[#F2F0EA] px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Project</span>
                    </Link>
                    <Link
                        to="/admin/certificates/create"
                        className="inline-flex items-center gap-2 border border-[#242629]/25 px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Certificate</span>
                    </Link>
                </div>
            </div>

            {/* METRIC CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.label}
                            to={card.link}
                            className={`border p-5 transition-colors ${card.highlight
                                    ? 'border-[#657568] bg-[#657568]/10'
                                    : 'border-[#242629]/20 bg-white/50 hover:border-[#657568]'
                                }`}
                        >
                            <div className="flex items-center justify-between text-[#657568] mb-3">
                                <Icon className="w-4 h-4" />
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                            </div>
                            <p className="font-display text-3xl font-extrabold">{card.value}</p>
                            <p className="font-mono text-[11px] uppercase tracking-wider text-[#242629]/70 mt-1">
                                {card.label}
                            </p>
                        </Link>
                    );
                })}
            </div>

            {/* RECENT ACTIVITY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Projects */}
                <div className="border border-[#242629]/20 bg-white/50 p-6">
                    <div className="flex items-center justify-between border-b border-[#242629]/15 pb-3 mb-4">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            Recent Projects
                        </h2>
                        <Link to="/admin/projects" className="font-mono text-xs underline">
                            All
                        </Link>
                    </div>
                    <div className="divide-y divide-[#242629]/10">
                        {recentProjects.length === 0 ? (
                            <p className="text-xs text-[#242629]/60 py-4">No projects yet.</p>
                        ) : (
                            recentProjects.map((proj) => (
                                <div key={proj._id} className="py-3 flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <Link
                                            to={`/admin/projects/edit/${proj._id}`}
                                            className="text-sm font-semibold hover:text-[#657568] truncate block"
                                        >
                                            {proj.title}
                                        </Link>
                                        <p className="font-mono text-[11px] text-[#242629]/60">
                                            {proj.category?.name} • {proj.year}
                                        </p>
                                    </div>
                                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 border border-[#242629]/20 shrink-0">
                                        {proj.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Certificates */}
                <div className="border border-[#242629]/20 bg-white/50 p-6">
                    <div className="flex items-center justify-between border-b border-[#242629]/15 pb-3 mb-4">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            Recent Certificates
                        </h2>
                        <Link to="/admin/certificates" className="font-mono text-xs underline">
                            All
                        </Link>
                    </div>
                    <div className="divide-y divide-[#242629]/10">
                        {recentCertificates.length === 0 ? (
                            <p className="text-xs text-[#242629]/60 py-4">No certificates yet.</p>
                        ) : (
                            recentCertificates.map((cert) => (
                                <div key={cert._id} className="py-3">
                                    <Link
                                        to={`/admin/certificates/edit/${cert._id}`}
                                        className="text-sm font-semibold hover:text-[#657568] truncate block"
                                    >
                                        {cert.title}
                                    </Link>
                                    <p className="font-mono text-[11px] text-[#242629]/60">
                                        {cert.issuer} • {new Date(cert.issuedAt).getFullYear()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Messages */}
                <div className="border border-[#242629]/20 bg-white/50 p-6">
                    <div className="flex items-center justify-between border-b border-[#242629]/15 pb-3 mb-4">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            Recent Messages
                        </h2>
                        <Link to="/admin/messages" className="font-mono text-xs underline">
                            Inbox
                        </Link>
                    </div>
                    <div className="divide-y divide-[#242629]/10">
                        {recentMessages.length === 0 ? (
                            <p className="text-xs text-[#242629]/60 py-4">No messages received yet.</p>
                        ) : (
                            recentMessages.map((msg) => (
                                <div key={msg._id} className="py-3 flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <Link
                                            to="/admin/messages"
                                            className="text-sm font-semibold hover:text-[#657568] truncate block"
                                        >
                                            {msg.subject}
                                        </Link>
                                        <p className="font-mono text-[11px] text-[#242629]/60 truncate">
                                            {msg.name} ({msg.email})
                                        </p>
                                    </div>
                                    <span
                                        className={`font-mono text-[10px] uppercase px-2 py-0.5 border shrink-0 ${msg.status === 'unread'
                                                ? 'border-[#657568] bg-[#657568] text-white'
                                                : 'border-[#242629]/20'
                                            }`}
                                    >
                                        {msg.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}