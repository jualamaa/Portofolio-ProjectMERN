import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/common/StateFeedback';
import { portfolioService } from '../services/portfolioService';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        portfolioService
            .getCategories('project')
            .then((cats) => setCategories(cats || []))
            .catch(() => { });
    }, []);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await portfolioService.getProjects({
                search: searchQuery,
                category: selectedCategory,
            });
            setProjects(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load projects.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return (
        <div className="editorial-container py-16 sm:py-24">
            <SectionHeader
                index="ARCHIVE /"
                eyebrow="Engineering Works"
                title="Projects & Case Studies"
                description="End-to-end software systems, database architectures, and hardware telemetry applications."
                theme="dark"
            />

            {/* FILTER CONTROLS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${selectedCategory === 'all'
                                ? 'bg-[#657568] border-[#657568] text-[#F2F0EA]'
                                : 'border-[#D9D4C9]/20 text-[#A5A39D] hover:border-[#F2F0EA] hover:text-[#F2F0EA]'
                            }`}
                    >
                        All Works
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${selectedCategory === cat.slug
                                    ? 'bg-[#657568] border-[#657568] text-[#F2F0EA]'
                                    : 'border-[#D9D4C9]/20 text-[#A5A39D] hover:border-[#F2F0EA] hover:text-[#F2F0EA]'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A39D]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by name or stack..."
                        className="w-full bg-white/[0.03] border border-[#D9D4C9]/20 pl-10 pr-4 py-2.5 text-sm text-[#F2F0EA] focus:outline-none focus:border-[#657568]"
                    />
                </div>
            </div>

            {/* EDITORIAL ASYMMETRIC PROJECT GRID */}
            {loading ? (
                <LoadingSkeleton count={3} theme="dark" />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchProjects} theme="dark" />
            ) : projects.length === 0 ? (
                <EmptyState
                    title="No projects found"
                    description="No case studies match the current search or category filter."
                    theme="dark"
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {projects.map((project, index) => {
                        const isWide = index % 3 === 0;
                        return (
                            <article
                                key={project._id}
                                className={`${isWide ? 'lg:col-span-7' : 'lg:col-span-5'
                                    } group border border-[#D9D4C9]/15 hover:border-[#657568] transition-colors flex flex-col justify-between`}
                            >
                                <div>
                                    <Link
                                        to={`/projects/${project.slug}`}
                                        className="block overflow-hidden bg-[#242629] border-b border-[#D9D4C9]/15"
                                    >
                                        <img
                                            src={project.coverImage?.url}
                                            alt={project.title}
                                            loading="lazy"
                                            className={`w-full ${isWide ? 'h-72 sm:h-80' : 'h-60 sm:h-64'
                                                } object-cover group-hover:scale-[1.02] transition-transform duration-500`}
                                        />
                                    </Link>

                                    <div className="p-6 sm:p-8">
                                        <div className="flex items-center justify-between text-xs font-mono text-[#A5A39D] mb-3">
                                            <span>{project.category?.name}</span>
                                            <span>
                                                {project.year} • {project.status}
                                            </span>
                                        </div>

                                        <h2 className="font-display text-2xl font-bold tracking-tight mb-3 group-hover:text-[#657568] transition-colors">
                                            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                                        </h2>

                                        <p className="text-sm text-[#A5A39D] leading-relaxed">{project.shortDescription}</p>
                                    </div>
                                </div>

                                <div className="px-6 sm:px-8 py-4 border-t border-[#D9D4C9]/15 flex items-center justify-between gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.map((tech) => (
                                            <span
                                                key={tech}
                                                className="text-[11px] font-mono px-2.5 py-0.5 border border-[#D9D4C9]/15 text-[#A5A39D]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <Link
                                        to={`/projects/${project.slug}`}
                                        className="shrink-0 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#F2F0EA] group-hover:text-[#657568]"
                                    >
                                        <span>Case Study</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}