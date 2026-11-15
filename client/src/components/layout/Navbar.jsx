import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Certificates', path: '/certificates' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
];

export default function Navbar({ theme = 'dark' }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isDark = theme === 'dark';

    return (
        <header
            className={`sticky top-0 z-40 border-b transition-colors duration-300 ${isDark
                    ? 'bg-[#17191C]/95 text-[#F2F0EA] border-[#D9D4C9]/15'
                    : 'bg-[#F2F0EA]/95 text-[#242629] border-[#242629]/15'
                }`}
        >
            <div className="editorial-container h-20 flex items-center justify-between">
                <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-2"
                >
                    <span>JOSEPH.DEV</span>
                    <span className="inline-block w-1.5 h-1.5 bg-[#657568]" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `text-xs font-mono uppercase tracking-[0.16em] py-1 transition-colors relative ${isActive
                                    ? 'text-[#657568] font-semibold'
                                    : isDark
                                        ? 'text-[#A5A39D] hover:text-[#F2F0EA]'
                                        : 'text-[#242629]/70 hover:text-[#242629]'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:flex items-center">
                    <Link
                        to="/contact"
                        className={`inline-flex items-center gap-1.5 border px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${isDark
                                ? 'border-[#D9D4C9]/30 hover:bg-[#657568] hover:border-[#657568] hover:text-[#F2F0EA]'
                                : 'border-[#242629]/30 hover:bg-[#17191C] hover:border-[#17191C] hover:text-[#F2F0EA]'
                            }`}
                    >
                        <span>Start a Talk</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Toggle Menu"
                    className="md:hidden p-2 border border-current/20"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileOpen && (
                <div
                    className={`md:hidden border-t px-6 py-6 space-y-4 ${isDark ? 'bg-[#17191C] border-[#D9D4C9]/15' : 'bg-[#F2F0EA] border-[#242629]/15'
                        }`}
                >
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `block font-mono text-sm uppercase tracking-widest py-2 ${isActive ? 'text-[#657568] font-semibold' : 'opacity-80'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </header>
    );
}