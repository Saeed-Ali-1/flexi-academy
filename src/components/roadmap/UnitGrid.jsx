import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, PlayCircle, Clock4 } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

function lessonIcon(completion) {
  if (completion >= 100) return CheckCircle2;
  if (completion > 0) return PlayCircle;
  return Circle;
}

export default function UnitGrid({ units, courseId }) {
  const navigate = useNavigate();
  if (!units?.length) {
    return (
      <div className="glass-card p-10 text-center text-muted">
        Detailed unit content for this quadmester is loading from your Moodle backend.
      </div>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {units.map((u, i) => (
        <motion.div
          key={u.id}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="glass-card p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="eyebrow">Unit {i + 1}</div>
              <h3 className="mt-1 font-display text-lg leading-tight">{u.title}</h3>
            </div>
            <span className="text-sm font-semibold text-iris-soft">{u.completion}%</span>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-white/[0.05] rounded-xl border border-white/[0.05]">
            {u.lessons.map((l) => {
              const Icon = lessonIcon(l.completion);
              return (
                <button
                  key={l.id}
                  onClick={() => navigate(`/courses/${courseId}/lessons/${l.id}`)}
                  className="flex items-center gap-3 px-3.5 py-3 text-left transition hover:bg-white/[0.03]"
                >
                  <Icon
                    size={16}
                    className={cn(
                      l.completion >= 100 ? 'text-aurora-soft' : l.completion > 0 ? 'text-iris-soft' : 'text-muted'
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-alabaster">{l.title}</div>
                    <div className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-muted">
                      <Clock4 size={11} /> {l.durationMin} min
                    </div>
                  </div>
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={cn(
                        'h-full',
                        l.completion >= 100 ? 'bg-aurora-gradient' : 'bg-iris-gradient'
                      )}
                      style={{ width: `${l.completion}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
