import { useState, useMemo } from 'react';
import { Search, ExternalLink, Award, Calendar, Hash } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import ModalLightbox from '../components/ui/ModalLightbox';
import { EmptyState } from '../components/common/StateFeedback';
import { TEMP_CERTIFICATES } from '../utils/mockPortfolioData';

const ITEMS_PER_PAGE = 6;

export default function CertificatesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeCert, setActiveCert] = useState(null);

    const categories = useMemo(
        () => ['all', ...new Set(TEMP_CERTIFICATES.map((c) => c.category.name))],
        []
    );

    const years = useMemo(
        () =>
            ['all', ...new Set(TEMP_CERTIFICATES.map((c) => new Date(c.issuedAt).getFullYear().toString()))],
        []
    );

    const filteredCerts = useMemo(() => {
        return TEMP_CERTIFICATES.filter((cert) => {
            const matchesSearch =
                cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat = selectedCategory === 'all' || cert.category.name === selectedCategory;
            const certYear = new Date(cert.issuedAt).getFullYear().toString();
            const matchesYear = selectedYear === 'all' || certYear === selectedYear;
            return matchesSearch && matchesCat && matchesYear;
        });
    }, [searchQuery, selectedCategory, selectedYear]);

    const totalPages = Math.max(1, Math.ceil(filteredCerts.length / ITEMS_PER_PAGE));
    const paginatedCerts = filteredCerts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat}
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
                        {years.map((yr) => (
                            <option key={yr} value={yr}>
                                {yr === 'all' ? 'All Years' : yr}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* CERTIFICATE GALLERY */}
            {paginatedCerts.length === 0 ? (
                <EmptyState
                    title="No matching certificates"
                    description="Try adjusting your search keywords, category, or year filter."
                    theme="light"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedCerts.map((cert) => (
                        <article
                            key={cert._id}
                            onClick={() => setActiveCert(cert)}
                            className="group cursor-pointer border border-[#242629]/20 bg-white/40 hover:border-[#657568] transition-colors flex flex-col justify-between"
                        >
                            <div>
                                <div className="aspect-[16/11] overflow-hidden bg-[#D9D4C9]/40 border-b border-[#242629]/15">
                                    <img
                                        src={cert.image.url}
                                        alt={cert.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between text-xs font-mono text-[#657568] mb-2">
                                        <span>{cert.category.name}</span>
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
            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => {
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
                                src={activeCert.image.url}
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