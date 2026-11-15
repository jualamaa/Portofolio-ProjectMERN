export default function ThemeWrapper({ theme = 'dark', children, className = '' }) {
    const themeClasses =
        theme === 'dark'
            ? 'bg-[#17191C] text-[#F2F0EA]'
            : 'bg-[#F2F0EA] text-[#242629]';

    return (
        <div data-theme={theme} className={`min-h-screen transition-colors duration-300 ${themeClasses} ${className}`}>
            {children}
        </div>
    );
}