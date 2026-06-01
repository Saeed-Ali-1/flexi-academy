import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useUIStore } from '../../lib/uiStore.js';
import { cn } from '../../lib/classNames.js';

const TONES = {
  success: { Icon: CheckCircle2, className: 'border-aurora/40 text-aurora-soft' },
  error: { Icon: AlertCircle, className: 'border-danger/40 text-danger' },
  info: { Icon: Info, className: 'border-iris/40 text-iris-soft' },
};

export default function ToastHost() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const tone = TONES[t.tone] ?? TONES.info;
          const Icon = tone.Icon;
          return (
            <motion.button
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => dismiss(t.id)}
              className={cn(
                'glass-card pointer-events-auto flex items-start gap-3 p-4 text-left',
                tone.className
              )}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-alabaster">{t.title}</div>
                {t.body && (
                  <div className="mt-0.5 truncate text-xs text-muted-soft">{t.body}</div>
                )}
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
