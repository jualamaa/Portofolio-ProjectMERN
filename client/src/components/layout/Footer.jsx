import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp, Lock } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';

export default function Footer({ theme = 'dark' }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        portfolioService
            .getProfile()
            .then((data) => setProfile(data))
            .catch(() => { });
    }, []);

    const isDark = theme === 'dark';

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            className={`border-t transition-colors ${isDark
                    ? 'bg-[#17191C] text-[#F2F0EA] border-white/10'
                    : 'bg-[#F2F0EA] text-[#242629] border-[#242629]/15'
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Top 3-Column Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-current/15">
                    {/* Brand & Tagline */}
                    <div className="md:col-span-6 space-y-3">
                        <Link to="/" className="font-display text-lg font-extrabold tracking-tight block">
                            {profile?.brandName || 'JOSEPH.DEV'}
                        </Link>
                        <p className="text-sm opacity-65 max-w-md leading-relaxed">
                            Fullstack web applications, structured database architectures, and hardware-integrated
                            digital solutions.
                        </p>
                    </div>

                    {/* Navigation Column */}
                    <div className="md:col-span-3 space-y-3">
                        <p className="font-mono text-[11px] uppercase tracking-widest opacity-45">
                            Navigation
                        </p>
                        <nav className="flex flex-col space-y-2 text-sm opacity-80">
                            <Link to="/" className="hover:opacity-100 hover:text-[#657568] transition-colors w-fit">
                                Home
                            </Link>
                            <Link to="/about" className="hover:opacity-100 hover:text-[#657568] transition-colors w-fit">
                                About
                            </Link>
                            <Link to="/certificates" className="hover:opacity-100 hover:text-[#657568] transition-colors w-fit">
                                Certificates
                            </Link>
                            <Link to="/projects" className="hover:opacity-100 hover:text-[#657568] transition-colors w-fit">
                                Projects
                            </Link>
                            <Link to="/contact" className="hover:opacity-100 hover:text-[#657568] transition-colors w-fit">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Connect Column */}
                    <div className="md:col-span-3 space-y-3">
                        <p className="font-mono text-[11px] uppercase tracking-widest opacity-45">
                            Connect
                        </p>
                        <div className="flex items-center gap-2.5">
                            <a
                                href={profile?.socialLinks?.github || 'https://github.com'}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="w-9 h-9 border border-current/20 flex items-center justify-center opacity-75 hover:opacity-100 hover:border-[#657568] hover:text-[#657568] transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="w-9 h-9 border border-current/20 flex items-center justify-center opacity-75 hover:opacity-100 hover:border-[#657568] hover:text-[#657568] transition-colors"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href={`mailto:${profile?.email || 'yosephekarunio@gmail.com'}`}
                                aria-label="Email"
                                className="w-9 h-9 border border-current/20 flex items-center justify-center opacity-75 hover:opacity-100 hover:border-[#657568] hover:text-[#657568] transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright & Admin Link */}
                <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
                    <div className="flex flex-wrap items-center gap-3 opacity-55">
                        <span>
                            © {new Date().getFullYear()} {profile?.brandName || 'JOSEPH.DEV'} — All rights reserved.
                        </span>
                        <Link
                            to="/admin"
                            title="Administrator Login"
                            className="inline-flex items-center gap-1 opacity-50 hover:opacity-100 hover:text-[#657568] transition-opacity"
                        >
                            <Lock className="w-3 h-3" />
                            <span>Admin</span>
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-1.5 uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[#657568] transition-colors"
                    >
                        <span>Back to top</span>
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}