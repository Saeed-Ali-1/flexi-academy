import { motion } from 'framer-motion';
import { CheckCircle2, Circle, CircleDashed } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

function statusFor(completion) {
  if (completion >= 100) return 'done';
  if (completion > 0) return 'active';
  return 'todo';
}

export default function QuadmesterTimeline({ quadmesters, activeId, onSelect }) {
  return (
    <div className="relative">
      <div className="absolute left-4 right-4 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />
      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
        {quadmesters.map((q) => {
          const status = statusFor(q.completion);
          const isActive = q.id === activeId;
          return (
            <button
              key={q.id}
              onClick={() => onSelect(q.id)}
              className={cn(
                'group relative flex flex-col items-start gap-2 rounded-2xl border bg-white/[0.02] px-4 py-4 text-left transition',
                isActive
                  ? 'border-iris/40 bg-iris/10 shadow-glow'
                  : 'border-white/[0.06] hover:bg-white/[0.05]'
              )}
              aria-pressed={isActive}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    'grid h-7 w-7 place-items-center rounded-full border',
                    status === 'done'
                      ? 'border-aurora/40 bg-aurora/15 text-aurora-soft'
                      : status === 'active'
                        ? 'border-iris/40 bg-iris/15 text-iris-soft'
                        : 'border-white/10 bg-white/[0.03] text-muted'
                  )}
                >
                  {status === 'done' ? <CheckCircle2 size={14} /> : status === 'active' ? <Circle size={14} /> : <CircleDashed size={14} />}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-muted">{q.completion}%</span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted">{q.label}</div>
                <div className="mt-0.5 font-display text-base leading-tight text-alabaster">{q.title}</div>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    status === 'done' ? 'bg-aurora-gradient' : 'bg-iris-gradient'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${q.completion}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
