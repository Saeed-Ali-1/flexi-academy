import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

const TONE_META = {
  aurora: { Icon: Sparkles, className: 'border-aurora/30 bg-aurora/10 text-aurora-soft' },
  amber: { Icon: AlertCircle, className: 'border-amber-warm/30 bg-amber-warm/10 text-amber-warm' },
  iris: { Icon: Lightbulb, className: 'border-iris/30 bg-iris/10 text-iris-soft' },
};

export default function TipsList({ tips }) {
  return (
    <div className="glass-card p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <div>
          <div className="eyebrow">Coach</div>
          <h3 className="mt-0.5 font-display text-lg">Three things to act on this week</h3>
        </div>
      </header>
      <div className="flex flex-col gap-3">
        {tips.map((t, i) => {
          const meta = TONE_META[t.tone] ?? TONE_META.iris;
          const Icon = meta.Icon;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn('flex items-start gap-3 rounded-xl border p-4', meta.className)}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-alabaster">{t.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-alabaster/80">{t.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
