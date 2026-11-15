export default function SectionHeader({ index, eyebrow, title, description, theme = 'dark', rightSlot = null }) {
    const isDark = theme === 'dark';

    return (
        <div
            className={`border-b pb-8 mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 ${isDark ? 'border-[#D9D4C9]/15' : 'border-[#242629]/15'
                }`}
        >
            <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                    {index && (
                        <span className="font-mono text-xs tracking-widest text-[#657568] font-medium">
                            {index}
                        </span>
                    )}
                    {eyebrow && (
                        <span
                            className={`font-mono text-xs uppercase tracking-[0.18em] ${isDark ? 'text-[#A5A39D]' : 'text-[#657568]'
                                }`}
                        >
                            {eyebrow}
                        </span>
                    )}
                </div>

                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                    {title}
                </h2>

                {description && (
                    <p
                        className={`mt-4 text-sm sm:text-base leading-relaxed max-w-2xl ${isDark ? 'text-[#A5A39D]' : 'text-[#242629]/75'
                            }`}
                    >
                        {description}
                    </p>
                )}
            </div>

            {rightSlot && <div className="shrink-0">{rightSlot}</div>}
        </div>
    );
}