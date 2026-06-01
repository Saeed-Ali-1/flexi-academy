import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

export default function Drawer({
  open,
  onClose,
  side = 'right',
  width = 'w-[420px]',
  title,
  children,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const x = side === 'right' ? '100%' : '-100%';
  const sideClass = side === 'right' ? 'right-0' : 'left-0';

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-midnight/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x }}
            animate={{ x: 0 }}
            exit={{ x }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={cn(
              'absolute top-0 h-full max-w-full',
              sideClass,
              width
            )}
          >
            <div className="flex h-full flex-col border-l border-white/[0.06] bg-slate-deep/95 backdrop-blur-xl">
              {(title || onClose) && (
                <header className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <h2 className="font-display text-xl">{title}</h2>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-alabaster"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </header>
              )}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
