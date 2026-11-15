import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ModalLightbox({ isOpen, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F2F0EA] text-[#242629] border border-[#242629]/20 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#242629]/15 pb-4 mb-6">
          <div>
            {subtitle && (
              <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-1">
                {subtitle}
              </p>
            )}
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 border border-[#242629]/20 hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}