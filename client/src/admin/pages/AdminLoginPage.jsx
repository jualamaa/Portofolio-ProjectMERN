import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
    const { admin, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (admin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [admin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter both administrator email and password.');
            return;
        }

        setSubmitting(true);
        try {
            await login(email.trim(), password);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Check your credentials.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F0EA] text-[#242629] flex flex-col justify-between p-6">
            <div className="max-w-md w-full mx-auto pt-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#242629]/70 hover:text-[#657568] transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Public Portfolio</span>
                </Link>
            </div>

            <div className="max-w-md w-full mx-auto border border-[#242629]/20 bg-white/60 p-8 sm:p-10">
                <div className="flex items-center gap-2.5 text-[#657568] mb-6">
                    <Lock className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase tracking-widest">Restricted Access</span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                    JOSEPH.DEV CMS
                </h1>
                <p className="text-sm text-[#242629]/70 mb-8">
                    Sign in with your administrator credentials to manage portfolio records.
                </p>

                {error && (
                    <div className="mb-6 p-3.5 border border-red-600/30 bg-red-50 text-red-700 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                        <label
                            htmlFor="admin-email"
                            className="block font-mono text-xs uppercase tracking-widest text-[#242629]/80 mb-2"
                        >
                            Administrator Email
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@joseph.dev"
                            className="w-full bg-white border border-[#242629]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#657568]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-password"
                            className="block font-mono text-xs uppercase tracking-widest text-[#242629]/80 mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-white border border-[#242629]/25 px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#657568]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#242629]/60 hover:text-[#242629]"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#17191C] text-[#F2F0EA] py-3.5 text-xs font-mono font-semibold uppercase tracking-widest hover:bg-[#657568] transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Authenticating...' : 'Authenticate Session'}
                    </button>
                </form>
            </div>

            <div className="max-w-md w-full mx-auto text-center pb-4 font-mono text-[11px] text-[#242629]/50">
                JOSEPH.DEV // SECURE ADMIN GATEWAY
            </div>
        </div>
    );
}