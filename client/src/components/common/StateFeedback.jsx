import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react';

export function LoadingSkeleton({ count = 3, theme = 'dark' }) {
    const isDark = theme === 'dark';
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className={`border p-6 animate-pulse ${isDark ? 'border-[#D9D4C9]/15 bg-white/[0.02]' : 'border-[#242629]/15 bg-black/[0.02]'
                        }`}
                >
                    <div className={`h-48 w-full mb-6 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                    <div className={`h-3 w-24 mb-3 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                    <div className={`h-6 w-3/4 mb-4 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                    <div className={`h-16 w-full ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
                </div>
            ))}
        </div>
    );
}

export function EmptyState({ title = 'No items available', description = 'Content will appear here once published.', theme = 'dark' }) {
    const isDark = theme === 'dark';
    return (
        <div
            className={`border py-16 px-6 text-center ${isDark ? 'border-[#D9D4C9]/15 text-[#A5A39D]' : 'border-[#242629]/15 text-[#242629]/70'
                }`}
        >
            <FolderOpen className="w-8 h-8 mx-auto mb-4 text-[#657568]" />
            <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-[#F2F0EA]' : 'text-[#242629]'}`}>
                {title}
            </h3>
            <p className="text-sm mt-2 max-w-md mx-auto">{description}</p>
        </div>
    );
}

export function ErrorState({ message = 'Unable to load content.', onRetry, theme = 'dark' }) {
    const isDark = theme === 'dark';
    return (
        <div
            className={`border p-8 text-center ${isDark ? 'border-red-500/30 bg-red-950/10' : 'border-red-600/30 bg-red-50'
                }`}
        >
            <AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-3" />
            <p className="text-sm font-medium">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center gap-2 border border-current px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] hover:text-[#F2F0EA] hover:border-[#657568] transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Request
                </button>
            )}
        </div>
    );
}