import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  showClose = true,
  maxWidth = 'max-w-md',
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-midnight/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={cn('relative w-full', maxWidth)}
          >
            <div className="glass-card relative grain overflow-hidden p-7">
              {showClose && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-alabaster"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              )}
              {title && (
                <h2 id="modal-title" className="font-display text-2xl leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-2 text-sm text-muted-soft">{description}</p>
              )}
              <div className={cn(title || description ? 'mt-5' : '')}>{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
