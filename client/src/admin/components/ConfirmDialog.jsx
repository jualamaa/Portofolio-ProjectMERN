import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
    isOpen,
    title = 'Confirm Deletion',
    message = 'Are you sure you want to permanently remove this record? This action cannot be undone.',
    confirmLabel = 'Delete Permanently',
    loading = false,
    onConfirm,
    onCancel,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-md bg-[#F2F0EA] text-[#242629] border border-[#242629]/25 p-6 sm:p-8 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 text-red-700">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <h3 className="font-display text-lg font-bold">{title}</h3>
                </div>

                <p className="text-sm text-[#242629]/80 leading-relaxed">{message}</p>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onCancel}
                        className="border border-[#242629]/25 px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-black/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className="bg-red-700 text-white px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-red-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}