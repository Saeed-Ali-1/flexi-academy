import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

function intensity(minutes) {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 90) return 3;
  return 4;
}

const LEVELS = [
  'bg-white/[0.04] border-white/[0.05]',
  'bg-iris/15 border-iris/20',
  'bg-iris/25 border-iris/30',
  'bg-iris/45 border-iris/40',
  'bg-iris-gradient border-iris/50 shadow-glow',
];

export default function StreakCalendar({ streak }) {
  const days = streak.last30Days;
  const totalMin = days.reduce((a, b) => a + b, 0);
  return (
    <div className="glass-card p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow">Consistency</div>
          <h3 className="mt-0.5 font-display text-lg">Last 30 days, on the dot.</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-amber-warm/30 bg-amber-warm/10 px-3 py-1.5 text-center">
            <div className="inline-flex items-center gap-1 text-sm font-bold text-amber-warm">
              <Flame size={14} /> {streak.currentDays}d
            </div>
            <div className="text-[9px] uppercase tracking-wide text-muted">Current</div>
          </div>
          <div className="rounded-xl border border-aurora/30 bg-aurora/10 px-3 py-1.5 text-center">
            <div className="inline-flex items-center gap-1 text-sm font-bold text-aurora-soft">
              <Trophy size={14} /> {streak.longestDays}d
            </div>
            <div className="text-[9px] uppercase tracking-wide text-muted">Longest</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5 sm:grid-cols-[repeat(30,minmax(0,1fr))]">
        {days.map((min, i) => {
          const level = intensity(min);
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.015, duration: 0.25 }}
              title={`Day -${days.length - i}: ${min} min`}
              className={cn('aspect-square rounded-md border', LEVELS[level])}
            />
          );
        })}
      </div>

      <footer className="mt-4 flex items-center justify-between text-[11px] text-muted">
        <span>
          {Math.round(totalMin / 60)}h total · target {Math.round(streak.weeklyMinutesGoal / 60)}h/week
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={cn('h-2.5 w-2.5 rounded-sm border', LEVELS[l])} />
          ))}
          <span>More</span>
        </span>
      </footer>
    </div>
  );
}
