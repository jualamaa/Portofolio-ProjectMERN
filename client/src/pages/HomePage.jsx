import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, MapPin, CircleDot, Terminal, Layers } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/common/StateFeedback';
import { portfolioService } from '../services/portfolioService';

export default function HomePage() {
    const [profile, setProfile] = useState(null);
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHomeData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, projectsRes, skillsData] = await Promise.all([
                portfolioService.getProfile(),
                portfolioService.getProjects({ featured: 'true', limit: 4 }),
                portfolioService.getSkills(),
            ]);
            setProfile(profileData);
            setFeaturedProjects(projectsRes.data || []);
            setSkills(skillsData || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load portfolio data from server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    if (loading) {
        return (
            <div className="editorial-container py-20">
                <LoadingSkeleton count={3} theme="dark" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="editorial-container py-20">
                <ErrorState message={error || 'Profile not configured.'} onRetry={fetchHomeData} theme="dark" />
            </div>
        );
    }

    return (
        <div>
            {/* HERO SECTION */}
            <section className="editorial-container py-16 sm:py-24 lg:py-28 border-b border-[#D9D4C9]/15">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#A5A39D]">
                            {profile.availability && (
                                <span className="inline-flex items-center gap-2 border border-[#657568]/60 bg-[#657568]/15 text-[#F2F0EA] px-3 py-1">
                                    <CircleDot className="w-3.5 h-3.5 text-[#657568]" />
                                    {profile.availability}
                                </span>
                            )}
                            {profile.location && (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#657568]" />
                                    {profile.location}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#A5A39D]">
                                {profile.name} — {profile.title}
                            </p>
                            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.04]">
                                {profile.headline}
                            </h1>
                        </div>

                        <p className="text-[#A5A39D] text-base sm:text-lg max-w-2xl leading-relaxed">
                            {profile.shortIntro}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-2.5 bg-[#F2F0EA] text-[#17191C] px-6 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest hover:bg-[#657568] hover:text-[#F2F0EA] transition-colors"
                            >
                                <span>Explore Projects</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2.5 border border-[#D9D4C9]/30 text-[#F2F0EA] px-6 py-3.5 text-xs font-mono uppercase tracking-widest hover:border-[#F2F0EA] transition-colors"
                            >
                                <span>Get In Touch</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Editorial Profile Frame */}
                    <div className="lg:col-span-4">
                        <div className="border border-[#D9D4C9]/20 p-4 bg-white/[0.01]">
                            <div className="aspect-[4/5] overflow-hidden bg-[#242629]">
                                {profile.profileImage?.url && (
                                    <img
                                        src={profile.profileImage.url}
                                        alt={profile.name}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                )}
                            </div>
                            <div className="pt-4 mt-4 border-t border-[#D9D4C9]/15 flex items-center justify-between text-xs font-mono text-[#A5A39D]">
                                <span>PORTRAIT // {new Date().getFullYear()}</span>
                                <span>{profile.brandName || 'JOSEPH.DEV'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PROJECTS */}
            <section className="editorial-container py-20 sm:py-24 border-b border-[#D9D4C9]/15">
                <SectionHeader
                    index="01 /"
                    eyebrow="Selected Work"
                    title="Featured Projects"
                    description="Architectural case studies spanning fullstack web applications, database workflows, and embedded IoT telemetry."
                    theme="dark"
                    rightSlot={
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F2F0EA] border-b border-[#657568] pb-1 hover:text-[#657568] transition-colors"
                        >
                            <span>View All Archive</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    }
                />

                {featuredProjects.length === 0 ? (
                    <EmptyState
                        title="No featured projects yet"
                        description="Featured projects published via the CMS will be showcased here."
                        theme="dark"
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {featuredProjects.map((project, idx) => {
                            const isPrimary = idx === 0;
                            return (
                                <article
                                    key={project._id}
                                    className={`${isPrimary ? 'lg:col-span-7' : 'lg:col-span-5'
                                        } group border border-[#D9D4C9]/15 hover:border-[#657568] transition-colors flex flex-col justify-between`}
                                >
                                    <div>
                                        <Link to={`/projects/${project.slug}`} className="block overflow-hidden bg-[#242629]">
                                            <img
                                                src={project.coverImage?.url}
                                                alt={project.title}
                                                loading="lazy"
                                                className={`w-full ${isPrimary ? 'h-72 sm:h-96' : 'h-60 sm:h-64'
                                                    } object-cover group-hover:scale-[1.02] transition-transform duration-500`}
                                            />
                                        </Link>

                                        <div className="p-6 sm:p-8">
                                            <div className="flex items-center justify-between text-xs font-mono text-[#A5A39D] mb-3">
                                                <span>{project.category?.name}</span>
                                                <span>{project.year}</span>
                                            </div>

                                            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-3 group-hover:text-[#657568] transition-colors">
                                                <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                                            </h3>

                                            <p className="text-sm text-[#A5A39D] leading-relaxed mb-6">
                                                {project.shortDescription}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 border-t border-[#D9D4C9]/10 flex items-center justify-between gap-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies?.slice(0, 4).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="text-[11px] font-mono px-2.5 py-1 border border-[#D9D4C9]/15 text-[#A5A39D]"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <Link
                                            to={`/projects/${project.slug}`}
                                            aria-label={`Read ${project.title} case study`}
                                            className="shrink-0 p-2 border border-[#D9D4C9]/20 group-hover:bg-[#657568] group-hover:border-[#657568] transition-colors"
                                        >
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* SHORT ABOUT & TECH STACK */}
            <section className="editorial-container py-20 sm:py-24 border-b border-[#D9D4C9]/15">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5 space-y-6">
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#657568]">
                            02 / Engineering Approach
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                            Structured Logic Meets Clean Interface.
                        </h2>
                        <p className="text-[#A5A39D] text-sm sm:text-base leading-relaxed">{profile.bio}</p>
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest border border-[#D9D4C9]/30 px-5 py-3 hover:bg-[#F2F0EA] hover:text-[#17191C] transition-colors"
                        >
                            <span>Read Full Background</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="lg:col-span-7 border border-[#D9D4C9]/15 p-6 sm:p-8">
                        <div className="flex items-center justify-between border-b border-[#D9D4C9]/15 pb-4 mb-6">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#A5A39D]">
                                Core Stack & Tools
                            </span>
                            <Layers className="w-4 h-4 text-[#657568]" />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {skills.map((skill) => (
                                <div
                                    key={skill._id}
                                    className="border border-[#D9D4C9]/15 p-3.5 hover:border-[#657568] transition-colors"
                                >
                                    <p className="font-medium text-sm text-[#F2F0EA]">{skill.name}</p>
                                    <p className="font-mono text-[11px] text-[#A5A39D] mt-1">{skill.category}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SELECTED ACHIEVEMENTS */}
            {profile.achievements?.length > 0 && (
                <section className="editorial-container py-20 sm:py-24 border-b border-[#D9D4C9]/15">
                    <SectionHeader index="03 /" eyebrow="Milestones" title="Selected Achievements" theme="dark" />

                    <div className="divide-y divide-[#D9D4C9]/15 border-y border-[#D9D4C9]/15">
                        {profile.achievements.map((item, index) => (
                            <div key={item._id || index} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <span className="md:col-span-1 font-mono text-xs text-[#657568]">0{index + 1}</span>
                                <h3 className="md:col-span-5 font-display text-lg font-semibold">{item.title}</h3>
                                <p className="md:col-span-3 text-sm text-[#A5A39D]">{item.context}</p>
                                <p className="md:col-span-3 font-mono text-xs text-[#F2F0EA] md:text-right">{item.metric}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CONTACT CTA */}
            <section className="editorial-container py-20 sm:py-28">
                <div className="border border-[#D9D4C9]/20 p-8 sm:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="max-w-2xl space-y-3">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            04 / Next Step
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                            Have a project, system architecture, or collaboration in mind?
                        </h2>
                        <p className="text-sm sm:text-base text-[#A5A39D]">
                            Reach out directly to discuss software engineering opportunities or technical builds.
                        </p>
                    </div>

                    <Link
                        to="/contact"
                        className="shrink-0 inline-flex items-center justify-center gap-2.5 bg-[#657568] text-[#F2F0EA] px-8 py-4 text-xs font-mono font-semibold uppercase tracking-widest hover:bg-[#F2F0EA] hover:text-[#17191C] transition-colors"
                    >
                        <Terminal className="w-4 h-4" />
                        <span>Initiate Contact</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}