import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, CircleDashed } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

const ACCENT_CLASS = {
  iris: 'bg-iris-gradient shadow-glow',
  aurora: 'bg-aurora-gradient shadow-glow-aurora',
  amber: 'bg-gradient-to-r from-amber-warm to-amber-warm/70',
};

const STATUS_ICON = {
  done: CheckCircle2,
  active: Circle,
  upcoming: CircleDashed,
  future: CircleDashed,
};
const STATUS_CLASS = {
  done: 'text-aurora-soft border-aurora/40 bg-aurora/15',
  active: 'text-iris-soft border-iris/40 bg-iris/15',
  upcoming: 'text-amber-warm border-amber-warm/30 bg-amber-warm/10',
  future: 'text-muted border-white/10 bg-white/[0.04]',
};

export default function YearTimeline({ overview }) {
  const navigate = useNavigate();
  return (
    <div className="glass-card overflow-hidden">
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="eyebrow">Your year, lane by lane</div>
            <h3 className="mt-1 font-display text-xl leading-tight">Where every course sits across the four quadmesters.</h3>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-aurora" /> Done</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-iris" /> Active</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-warm" /> Upcoming</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white/15" /> Future</span>
          </div>
        </div>
      </header>

      <div className="px-6 pb-6 pt-2">
        <div className="grid grid-cols-[140px_repeat(4,1fr)] gap-x-3 gap-y-1 pb-3 text-[10px] uppercase tracking-wide text-muted">
          <div />
          {overview.quadmesters.map((q) => {
            const Icon = STATUS_ICON[q.status];
            return (
              <div key={q.id} className="flex items-center gap-2">
                <span className={cn('grid h-5 w-5 place-items-center rounded-full border', STATUS_CLASS[q.status])}>
                  <Icon size={11} />
                </span>
                <span className="text-alabaster">{q.label}</span>
                <span className="text-muted">· {q.weeksRange}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5">
          {overview.courseLanes.map((lane, laneIdx) => (
            <motion.button
              key={lane.courseId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: laneIdx * 0.04, duration: 0.3 }}
              onClick={() => navigate(`/courses/${lane.courseId}`)}
              className="group grid grid-cols-[140px_repeat(4,1fr)] items-center gap-x-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-white/[0.04]"
            >
              <div className="truncate text-sm font-medium text-alabaster group-hover:text-iris-soft">
                {lane.title}
              </div>
              {lane.q.map((pct, i) => (
                <div key={i} className="relative h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    className={cn('absolute inset-y-0 left-0 rounded-full', ACCENT_CLASS[lane.accent] ?? ACCENT_CLASS.iris)}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 + i * 0.04 }}
                  />
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-alabaster/80">
                    {pct > 0 ? `${pct}%` : ''}
                  </span>
                </div>
              ))}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
