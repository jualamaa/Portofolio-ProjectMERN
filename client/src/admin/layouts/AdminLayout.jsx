import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    Award,
    UserCircle,
    Tags,
    Cpu,
    Mail,
    LogOut,
    Menu,
    X,
    ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ADMIN_NAV = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Profile', path: '/admin/profile', icon: UserCircle },
    { label: 'Categories', path: '/admin/categories', icon: Tags },
    { label: 'Skills', path: '/admin/skills', icon: Cpu },
    { label: 'Messages', path: '/admin/messages', icon: Mail },
];

export default function AdminLayout() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#F2F0EA] text-[#242629] flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[#242629]/15 bg-[#EAE7DF]">
                <div className="h-16 px-6 flex items-center justify-between border-b border-[#242629]/15">
                    <Link to="/admin/dashboard" className="font-display font-extrabold text-lg tracking-tight">
                        JOSEPH.DEV <span className="font-mono text-[10px] text-[#657568] ml-1">CMS</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {ADMIN_NAV.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${isActive
                                        ? 'bg-[#17191C] text-[#F2F0EA] font-semibold'
                                        : 'text-[#242629]/75 hover:bg-black/5 hover:text-[#242629]'
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#242629]/15 space-y-3">
                    <div className="px-2">
                        <p className="text-xs font-semibold truncate">{admin?.name}</p>
                        <p className="font-mono text-[11px] text-[#242629]/60 truncate">{admin?.email}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 border border-[#242629]/25 py-2 text-xs font-mono uppercase tracking-wider hover:bg-red-700 hover:border-red-700 hover:text-white transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                <header className="h-16 border-b border-[#242629]/15 bg-[#F2F0EA]/95 sticky top-0 z-30 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            aria-label="Toggle Admin Sidebar"
                            className="lg:hidden p-2 border border-[#242629]/20"
                        >
                            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                        <span className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            Administrator Console
                        </span>
                    </div>

                    <Link
                        to="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider border border-[#242629]/20 px-3 py-1.5 hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                    >
                        <span>View Live Site</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </header>

                {/* Mobile Sidebar Drawer */}
                {sidebarOpen && (
                    <div className="lg:hidden border-b border-[#242629]/15 bg-[#EAE7DF] p-4 space-y-1">
                        {ADMIN_NAV.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider ${isActive ? 'bg-[#17191C] text-[#F2F0EA]' : 'text-[#242629]/80'
                                        }`
                                    }
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full mt-3 flex items-center justify-center gap-2 border border-[#242629]/25 py-2.5 text-xs font-mono uppercase tracking-wider text-red-700"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}

                <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}