import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedAdminRoute() {
    const { admin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F2F0EA] text-[#242629] flex items-center justify-center">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                    <Loader2 className="w-4 h-4 animate-spin text-[#657568]" />
                    <span>Verifying Administrator Session...</span>
                </div>
            </div>
        );
    }

    if (!admin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}