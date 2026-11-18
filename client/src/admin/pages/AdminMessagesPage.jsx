import { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, CheckCircle, Reply, MailOpen } from 'lucide-react';
import { adminService } from '../../services/adminService';
import ConfirmDialog from '../components/ConfirmDialog';
import { EmptyState } from '../../components/common/StateFeedback';

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadMessages = useCallback(async () => {
        const list = await adminService.getMessages(statusFilter);
        setMessages(list);
    }, [statusFilter]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleSelectMessage = async (msg) => {
        if (msg.status === 'unread') {
            const updated = await adminService.getMessageById(msg._id);
            setSelectedMsg(updated);
            setMessages((prev) => prev.map((m) => (m._id === msg._id ? updated : m)));
        } else {
            setSelectedMsg(msg);
        }
    };

    const handleStatusChange = async (id, nextStatus) => {
        const res = await adminService.updateMessageStatus(id, nextStatus);
        setMessages((prev) => prev.map((m) => (m._id === id ? res.data : m)));
        if (selectedMsg?._id === id) setSelectedMsg(res.data);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await adminService.deleteMessage(deleteTarget._id);
        setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
        if (selectedMsg?._id === deleteTarget._id) setSelectedMsg(null);
        setDeleteTarget(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#242629]/15 pb-6">
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-1">Inbox</p>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight">Contact Messages</h1>
                </div>

                <div className="flex gap-2">
                    {['all', 'unread', 'read', 'replied'].map((st) => (
                        <button
                            key={st}
                            type="button"
                            onClick={() => setStatusFilter(st)}
                            className={`px-3.5 py-2 text-xs font-mono uppercase border transition-colors ${statusFilter === st
                                ? 'bg-[#17191C] text-[#F2F0EA] border-[#17191C]'
                                : 'border-[#242629]/20 hover:border-[#657568]'
                                }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            {messages.length === 0 ? (
                <EmptyState
                    title="Inbox is empty"
                    description="Messages submitted from the public contact form will appear here."
                    theme="light"
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LIST */}
                    <div className="lg:col-span-5 border border-[#242629]/20 bg-white/60 divide-y divide-[#242629]/10">
                        {messages.map((msg) => (
                            <button
                                key={msg._id}
                                type="button"
                                onClick={() => handleSelectMessage(msg)}
                                className={`w-full text-left p-4 transition-colors ${selectedMsg?._id === msg._id ? 'bg-[#17191C] text-[#F2F0EA]' : 'hover:bg-black/5'
                                    }`}
                            >
                                <div className="flex items-center justify-between text-xs font-mono mb-1">
                                    <span className="truncate font-semibold">{msg.name}</span>
                                    <span
                                        className={`uppercase text-[10px] px-2 py-0.5 border ${msg.status === 'unread'
                                            ? 'border-[#657568] bg-[#657568] text-white'
                                            : 'border-current/25 opacity-75'
                                            }`}
                                    >
                                        {msg.status}
                                    </span>
                                </div>
                                <p className="text-sm font-medium truncate">{msg.subject}</p>
                                <p className="font-mono text-[11px] opacity-65 mt-1">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* DETAIL */}
                    <div className="lg:col-span-7 border border-[#242629]/20 bg-white/60 p-6 sm:p-8">
                        {!selectedMsg ? (
                            <div className="h-64 flex flex-col items-center justify-center text-[#242629]/50">
                                <Mail className="w-8 h-8 mb-2" />
                                <p className="font-mono text-xs uppercase">Select a message to inspect</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="border-b border-[#242629]/15 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div>
                                        <h2 className="font-display text-xl font-bold">{selectedMsg.subject}</h2>
                                        <p className="text-sm text-[#242629]/80 mt-1">
                                            From: <strong>{selectedMsg.name}</strong> ({selectedMsg.email})
                                        </p>
                                        <p className="font-mono text-xs text-[#242629]/55 mt-1">
                                            {new Date(selectedMsg.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange(selectedMsg._id, 'unread')}
                                            className="inline-flex items-center gap-1 border border-[#242629]/25 px-2.5 py-1.5 text-xs font-mono"
                                        >
                                            <MailOpen className="w-3.5 h-3.5" /> Unread
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange(selectedMsg._id, 'read')}
                                            className="inline-flex items-center gap-1 border border-[#242629]/25 px-2.5 py-1.5 text-xs font-mono"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" /> Read
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange(selectedMsg._id, 'replied')}
                                            className="inline-flex items-center gap-1 border border-[#657568] bg-[#657568] text-white px-2.5 py-1.5 text-xs font-mono"
                                        >
                                            <Reply className="w-3.5 h-3.5" /> Replied
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(selectedMsg)}
                                            className="inline-flex items-center gap-1 border border-red-600/30 text-red-700 px-2.5 py-1.5 text-xs font-mono"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#242629]/90">
                                    {selectedMsg.message}
                                </div>

                                <div className="pt-4 border-t border-[#242629]/15">
                                    <a
                                        href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(
                                            selectedMsg.subject
                                        )}`}
                                        onClick={() => handleStatusChange(selectedMsg._id, 'replied')}
                                        className="inline-flex items-center gap-2 bg-[#17191C] text-[#F2F0EA] px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#657568]"
                                    >
                                        <Reply className="w-3.5 h-3.5" />
                                        <span>Reply via Email Client</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                title="Delete Message"
                message={`Permanently delete message from "${deleteTarget?.name}"?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}