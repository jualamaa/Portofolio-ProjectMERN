import { useState, useEffect, useCallback } from 'react';
import { Search, ExternalLink, Award, Calendar, Hash } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import ModalLightbox from '../components/ui/ModalLightbox';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/common/StateFeedback';
import { portfolioService } from '../services/portfolioService';

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [years, setYears] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCert, setActiveCert] = useState(null);

    useEffect(() => {
        portfolioService
            .getCategories('certificate')
            .then((cats) => setCategories(cats || []))
            .catch(() => { });
    }, []);

    const fetchCertificates = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await portfolioService.getCertificates({
                search: searchQuery,
                category: selectedCategory,
                year: selectedYear,
                page: currentPage,
                limit: 6,
            });
            setCertificates(res.data || []);
            setYears(res.availableYears || []);
            setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load certificates.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory, selectedYear, currentPage]);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    return (
        <div className="editorial-container py-16 sm:py-24">
            <SectionHeader
                index="CREDENTIALS /"
                eyebrow="Verified Learning"
                title="Certificates & Technical Accreditations"
                description="Formal coursework completions, infrastructure training, and software development credentials."
                theme="light"
            />

            {/* FILTER & SEARCH BAR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">
                <div className="md:col-span-6 relative">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#242629]/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search certificate title or issuer..."
                        className="w-full bg-white/60 border border-[#242629]/20 pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#657568]"
                    />
                </div>

                <div className="md:col-span-3">
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        aria-label="Filter by category"
                        className="w-full bg-white/60 border border-[#242629]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#657568]"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.slug}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setCurrentPage(1);
                        }}
                        aria-label="Filter by year"
                        className="w-full bg-white/60 border border-[#242629]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#657568]"
                    >
                        <option value="all">All Years</option>
                        {years.map((yr) => (
                            <option key={yr} value={yr}>
                                {yr}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* STATES & GALLERY */}
            {loading ? (
                <LoadingSkeleton count={3} theme="light" />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchCertificates} theme="light" />
            ) : certificates.length === 0 ? (
                <EmptyState
                    title="No matching certificates"
                    description="Try adjusting your search keywords, category, or year filter."
                    theme="light"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <article
                            key={cert._id}
                            onClick={() => setActiveCert(cert)}
                            className="group cursor-pointer border border-[#242629]/20 bg-white/40 hover:border-[#657568] transition-colors flex flex-col justify-between"
                        >
                            <div>
                                <div className="aspect-[16/11] overflow-hidden bg-[#D9D4C9]/40 border-b border-[#242629]/15">
                                    <img
                                        src={cert.image?.url}
                                        alt={cert.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between text-xs font-mono text-[#657568] mb-2">
                                        <span>{cert.category?.name}</span>
                                        <span>
                                            {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-lg font-bold tracking-tight group-hover:text-[#657568] transition-colors">
                                        {cert.title}
                                    </h3>
                                    <p className="text-sm text-[#242629]/75 mt-1">{cert.issuer}</p>
                                </div>
                            </div>

                            <div className="px-6 py-3.5 border-t border-[#242629]/10 flex items-center justify-between text-xs font-mono text-[#242629]/65">
                                <span>{cert.credentialId ? `ID: ${cert.credentialId}` : 'Verified Credential'}</span>
                                <span className="underline">Inspect</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            {pagination.pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    {Array.from({ length: pagination.pages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                            <button
                                key={pageNum}
                                type="button"
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 font-mono text-xs border transition-colors ${currentPage === pageNum
                                    ? 'bg-[#17191C] text-[#F2F0EA] border-[#17191C]'
                                    : 'border-[#242629]/20 hover:border-[#657568]'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* CERTIFICATE DETAIL MODAL */}
            <ModalLightbox
                isOpen={Boolean(activeCert)}
                onClose={() => setActiveCert(null)}
                title={activeCert?.title}
                subtitle={`${activeCert?.issuer} — ${activeCert?.category?.name}`}
            >
                {activeCert && (
                    <div className="space-y-6">
                        <div className="border border-[#242629]/20 bg-white">
                            <img
                                src={activeCert.image?.url}
                                alt={activeCert.title}
                                className="w-full max-h-[55vh] object-contain mx-auto"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-[#242629]/15 py-4 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-[#657568]" />
                                <span>Issuer: {activeCert.issuer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#657568]" />
                                <span>
                                    Issued:{' '}
                                    {new Date(activeCert.issuedAt).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            {activeCert.credentialId && (
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-[#657568]" />
                                    <span>ID: {activeCert.credentialId}</span>
                                </div>
                            )}
                        </div>

                        {activeCert.description && (
                            <p className="text-sm text-[#242629]/80 leading-relaxed">{activeCert.description}</p>
                        )}

                        {activeCert.credentialUrl && (
                            <div className="pt-2">
                                <a
                                    href={activeCert.credentialUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#17191C] text-[#F2F0EA] px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] transition-colors"
                                >
                                    <span>Verify External Credential</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </ModalLightbox>
        </div>
    );
}