import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    Github,
    ExternalLink,
    CheckSquare,
    Maximize2,
} from 'lucide-react';
import ModalLightbox from '../components/ui/ModalLightbox';
import { LoadingSkeleton, EmptyState } from '../components/common/StateFeedback';
import { portfolioService } from '../services/portfolioService';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ProjectDetailPage() {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);

    usePageMeta({
        title: data?.project?.title || 'Project Case Study',
        description: data?.project?.shortDescription || 'Detailed engineering case study.',
    });

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        setNotFound(false);
        try {
            const result = await portfolioService.getProjectBySlug(slug);
            setData(result);
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    if (loading) {
        return (
            <div className="editorial-container py-20">
                <LoadingSkeleton count={2} theme="light" />
            </div>
        );
    }

    if (notFound || !data?.project) {
        return (
            <div className="editorial-container py-24">
                <EmptyState
                    title="Project case study not found"
                    description="The requested project slug does not exist or has not been published."
                    theme="light"
                />
                <div className="mt-8 text-center">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 border border-[#242629]/30 px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Projects</span>
                    </Link>
                </div>
            </div>
        );
    }

    const { project, prevProject, nextProject, relatedProjects } = data;

    return (
        <article className="editorial-container py-12 sm:py-20">
            <div className="mb-8">
                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#242629]/70 hover:text-[#657568] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>All Projects</span>
                </Link>
            </div>

            {/* HEADER & METADATA */}
            <header className="border-b border-[#242629]/15 pb-10 mb-12">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#657568] mb-4">
                    <span>{project.category?.name}</span>
                    <span>•</span>
                    <span>Year {project.year}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] max-w-4xl">
                    {project.title}
                </h1>

                <p className="mt-6 text-base sm:text-lg text-[#242629]/80 max-w-3xl leading-relaxed">
                    {project.overview}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-[#17191C] text-[#F2F0EA] px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span>Source Repository</span>
                        </a>
                    )}
                    {project.demoUrl && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 border border-[#242629]/30 px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Live Deployment</span>
                        </a>
                    )}
                </div>
            </header>

            {/* COVER IMAGE */}
            <div className="mb-16 border border-[#242629]/20 bg-white/50 p-2 sm:p-3">
                <img
                    src={project.coverImage?.url}
                    alt={project.title}
                    className="w-full max-h-[620px] object-cover"
                />
            </div>

            {/* CASE STUDY STRUCTURED BREAKDOWN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#242629]/15">
                <div className="lg:col-span-8 space-y-12">
                    {project.background && (
                        <section className="space-y-3">
                            <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                                01 / Context & Background
                            </h2>
                            <p className="text-base text-[#242629]/85 leading-relaxed">{project.background}</p>
                        </section>
                    )}

                    {(project.problem || project.solution) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-[#242629]/15 py-8">
                            <section className="space-y-3">
                                <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                                    02 / Problem Statement
                                </h2>
                                <p className="text-sm sm:text-base text-[#242629]/85 leading-relaxed">
                                    {project.problem}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                                    03 / Engineered Solution
                                </h2>
                                <p className="text-sm sm:text-base text-[#242629]/85 leading-relaxed">
                                    {project.solution}
                                </p>
                            </section>
                        </div>
                    )}

                    {project.features?.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                                04 / Key System Features
                            </h2>
                            <ul className="space-y-3">
                                {project.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base">
                                        <CheckSquare className="w-4 h-4 text-[#657568] shrink-0 mt-1" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {project.challenges && (
                        <section className="border border-[#242629]/15 bg-white/40 p-6 sm:p-8 space-y-3">
                            <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                                05 / Technical Challenges & Resolution
                            </h2>
                            <p className="text-sm sm:text-base text-[#242629]/85 leading-relaxed">
                                {project.challenges}
                            </p>
                        </section>
                    )}
                </div>

                {/* SIDEBAR SPECIFICATIONS */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="border border-[#242629]/20 p-6 bg-white/40 space-y-6">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-3">
                                Technology Stack
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.map((tech) => (
                                    <span
                                        key={tech}
                                        className="font-mono text-xs px-3 py-1.5 border border-[#242629]/20 bg-[#F2F0EA]"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-[#242629]/15 pt-4 space-y-2 text-xs font-mono">
                            <div className="flex justify-between">
                                <span className="text-[#242629]/60">CATEGORY</span>
                                <span>{project.category?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#242629]/60">RELEASE YEAR</span>
                                <span>{project.year}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#242629]/60">STATUS</span>
                                <span className="uppercase">{project.status}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* SCREENSHOT GALLERY */}
            {project.gallery?.length > 0 && (
                <section className="py-16 border-b border-[#242629]/15">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-8">
                        06 / Interface & System Screenshots
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project.gallery.map((img, idx) => (
                            <figure
                                key={img._id || idx}
                                onClick={() => setLightboxImage(img)}
                                className="group cursor-pointer border border-[#242629]/20 bg-white/50 overflow-hidden"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={img.url}
                                        alt={img.caption || `${project.title} screenshot ${idx + 1}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                    />
                                    <span className="absolute bottom-3 right-3 bg-[#17191C]/85 text-[#F2F0EA] p-2">
                                        <Maximize2 className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                                {img.caption && (
                                    <figcaption className="p-4 text-xs font-mono text-[#242629]/75 border-t border-[#242629]/10">
                                        {img.caption}
                                    </figcaption>
                                )}
                            </figure>
                        ))}
                    </div>
                </section>
            )}

            {/* PREVIOUS & NEXT NAVIGATION */}
            <nav
                aria-label="Project Pagination"
                className="py-12 border-b border-[#242629]/15 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
                <div>
                    {prevProject && (
                        <Link
                            to={`/projects/${prevProject.slug}`}
                            className="group block border border-[#242629]/20 p-5 hover:border-[#657568] transition-colors"
                        >
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#657568]">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                PREVIOUS PROJECT
                            </span>
                            <p className="font-display font-bold mt-1 group-hover:text-[#657568]">
                                {prevProject.title}
                            </p>
                        </Link>
                    )}
                </div>

                <div className="sm:text-right">
                    {nextProject && (
                        <Link
                            to={`/projects/${nextProject.slug}`}
                            className="group block border border-[#242629]/20 p-5 hover:border-[#657568] transition-colors"
                        >
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#657568]">
                                NEXT PROJECT
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                            <p className="font-display font-bold mt-1 group-hover:text-[#657568]">
                                {nextProject.title}
                            </p>
                        </Link>
                    )}
                </div>
            </nav>

            {/* RELATED PROJECTS */}
            {relatedProjects?.length > 0 && (
                <section className="pt-16">
                    <h2 className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-8">
                        Related Case Studies
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {relatedProjects.map((rel) => (
                            <Link
                                key={rel._id}
                                to={`/projects/${rel.slug}`}
                                className="group border border-[#242629]/20 p-6 bg-white/30 hover:border-[#657568] transition-colors"
                            >
                                <span className="font-mono text-xs text-[#657568]">{rel.category?.name}</span>
                                <h3 className="font-display text-xl font-bold mt-1 group-hover:text-[#657568]">
                                    {rel.title}
                                </h3>
                                <p className="text-sm text-[#242629]/75 mt-2 line-clamp-2">
                                    {rel.shortDescription}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* LIGHTBOX MODAL */}
            <ModalLightbox
                isOpen={Boolean(lightboxImage)}
                onClose={() => setLightboxImage(null)}
                title={project.title}
                subtitle="Project Screenshot Preview"
            >
                {lightboxImage && (
                    <div className="space-y-4">
                        <img
                            src={lightboxImage.url}
                            alt={lightboxImage.caption || project.title}
                            className="w-full max-h-[65vh] object-contain mx-auto border border-[#242629]/15"
                        />
                        {lightboxImage.caption && (
                            <p className="text-xs font-mono text-[#242629]/80">{lightboxImage.caption}</p>
                        )}
                    </div>
                )}
            </ModalLightbox>
        </article>
    );
}