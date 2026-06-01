import { motion } from 'framer-motion';
import { cn } from '../../lib/classNames.js';

const TONE_CLASS = {
  iris: 'bg-iris-gradient shadow-glow',
  aurora: 'bg-aurora-gradient shadow-glow-aurora',
  amber: 'bg-gradient-to-r from-amber-warm to-amber-warm/70',
};

export default function ActivityBreakdown({ data }) {
  const total = data.reduce((a, b) => a + b.minutes, 0);
  return (
    <div className="glass-card p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <div>
          <div className="eyebrow">Activity mix</div>
          <h3 className="mt-0.5 font-display text-lg">How you spent your study time</h3>
        </div>
        <span className="text-xs text-muted">{Math.round(total / 60)}h total</span>
      </header>

      <div className="mb-5 flex h-3 w-full overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.04]">
        {data.map((d, i) => (
          <motion.div
            key={d.type}
            initial={{ width: 0 }}
            animate={{ width: `${d.percent}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.06 }}
            className={cn('h-full', TONE_CLASS[d.tone] ?? TONE_CLASS.iris)}
            title={`${d.type}: ${d.percent}%`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {data.map((d) => (
          <div key={d.type} className="flex items-center gap-3">
            <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', TONE_CLASS[d.tone] ?? TONE_CLASS.iris)} />
            <span className="flex-1 text-sm text-alabaster">{d.type}</span>
            <span className="text-xs text-muted">{Math.round(d.minutes / 60 * 10) / 10}h</span>
            <span className="w-10 text-right text-sm font-semibold text-alabaster">{d.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
