import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { TEMP_PROFILE } from '../../utils/mockPortfolioData';

export default function Footer({ theme = 'dark' }) {
    const isDark = theme === 'dark';

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            className={`border-t transition-colors duration-300 ${isDark
                    ? 'bg-[#17191C] text-[#F2F0EA] border-[#D9D4C9]/15'
                    : 'bg-[#F2F0EA] text-[#242629] border-[#242629]/15'
                }`}
        >
            <div className="editorial-container py-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-current/15">
                    <div className="md:col-span-6 space-y-4">
                        <Link to="/" className="font-display text-xl font-extrabold tracking-tight inline-block">
                            JOSEPH.DEV
                        </Link>
                        <p className={`text-sm max-w-md leading-relaxed ${isDark ? 'text-[#A5A39D]' : 'text-[#242629]/75'}`}>
                            Fullstack web applications, structured database architectures, and hardware-integrated digital solutions.
                        </p>
                    </div>

                    <div className="md:col-span-3 space-y-3">
                        <p className="font-mono text-xs uppercase tracking-widest text-[#657568]">Navigation</p>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-[#657568] transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-[#657568] transition-colors">About</Link></li>
                            <li><Link to="/certificates" className="hover:text-[#657568] transition-colors">Certificates</Link></li>
                            <li><Link to="/projects" className="hover:text-[#657568] transition-colors">Projects</Link></li>
                            <li><Link to="/contact" className="hover:text-[#657568] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 space-y-3">
                        <p className="font-mono text-xs uppercase tracking-widest text-[#657568]">Connect</p>
                        <div className="flex items-center gap-3">
                            <a
                                href={TEMP_PROFILE.socialLinks.github}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="p-2.5 border border-current/20 hover:bg-[#657568] hover:border-[#657568] hover:text-[#F2F0EA] transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href={TEMP_PROFILE.socialLinks.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="p-2.5 border border-current/20 hover:bg-[#657568] hover:border-[#657568] hover:text-[#F2F0EA] transition-colors"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <Link
                                to="/contact"
                                aria-label="Contact Email"
                                className="p-2.5 border border-current/20 hover:bg-[#657568] hover:border-[#657568] hover:text-[#F2F0EA] transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono opacity-75">
                    <span>© {new Date().getFullYear()} JOSEPH.DEV — All rights reserved.</span>
                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-1.5 hover:text-[#657568] transition-colors"
                    >
                        <span>BACK TO TOP</span>
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}