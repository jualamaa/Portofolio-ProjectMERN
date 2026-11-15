import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="editorial-container py-28 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-3">
                ERROR 404
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
                Page Not Found
            </h1>
            <p className="text-sm sm:text-base text-[#A5A39D] max-w-md mx-auto mb-8">
                The route you requested does not exist on JOSEPH.DEV.
            </p>
            <Link
                to="/"
                className="inline-flex items-center gap-2 border border-[#D9D4C9]/30 px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-[#657568] hover:border-[#657568] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Return Home</span>
            </Link>
        </div>
    );
}