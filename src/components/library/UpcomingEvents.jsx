import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Radio, FileText, BookOpen } from 'lucide-react';
import { useMoodleQuery } from '../../hooks/useMoodleQuery.js';
import { getMoodleClient } from '../../api/moodleClient.js';
import Skeleton from '../ui/Skeleton.jsx';
import { cn } from '../../lib/classNames.js';

const TYPE = {
  live: { Icon: Radio, label: 'Live class', className: 'bg-iris/15 text-iris-soft' },
  assessment: { Icon: FileText, label: 'Assessment', className: 'bg-amber-warm/15 text-amber-warm' },
  lesson: { Icon: BookOpen, label: 'Lesson', className: 'bg-aurora/15 text-aurora-soft' },
};

export default function UpcomingEvents() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);
  const { data, isLoading } = useMoodleQuery(() => getMoodleClient().getUpcomingEvents(), [tick]);

  return (
    <div className="glass-card p-5">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-iris-soft" />
          <h3 className="font-display text-lg">Upcoming</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-muted">Auto-refresh</span>
      </header>

      <div className="flex flex-col gap-2">
        {isLoading
          ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)
          : (data ?? []).map((e, idx) => {
              const t = TYPE[e.type] ?? TYPE.lesson;
              const Icon = t.Icon;
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition hover:bg-white/[0.05]"
                >
                  <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', t.className)}>
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-tight text-alabaster">{e.title}</div>
                    <div className="mt-0.5 truncate text-[11px] text-muted">{e.courseTitle}</div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-soft">
                      <span className="text-iris-soft">{e.startsLabel}</span>
                      {e.durationMin && <span>· {e.durationMin}m</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}
