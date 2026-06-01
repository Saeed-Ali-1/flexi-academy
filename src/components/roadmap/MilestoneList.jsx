import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, GraduationCap, Mic, ClipboardCheck, FlaskConical, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

const TYPE = {
  assessment: { Icon: FlaskConical, className: 'text-iris-soft bg-iris/10 border-iris/30' },
  assignment: { Icon: FileText, className: 'text-amber-warm bg-amber-warm/10 border-amber-warm/30' },
  exam: { Icon: GraduationCap, className: 'text-aurora-soft bg-aurora/10 border-aurora/30' },
  presentation: { Icon: Mic, className: 'text-iris-soft bg-iris/10 border-iris/30' },
  quiz: { Icon: ClipboardCheck, className: 'text-aurora-soft bg-aurora/10 border-aurora/30' },
};

function urgencyTone(daysAway) {
  if (daysAway <= 3) return { ring: 'ring-1 ring-danger/30', label: 'text-danger' };
  if (daysAway <= 7) return { ring: 'ring-1 ring-amber-warm/30', label: 'text-amber-warm' };
  return { ring: '', label: 'text-muted-soft' };
}

export default function MilestoneList({ milestones }) {
  const navigate = useNavigate();
  return (
    <div className="glass-card overflow-hidden">
      <header className="flex items-baseline justify-between border-b border-white/[0.06] px-5 py-4">
        <div>
          <div className="eyebrow">Coming up</div>
          <h3 className="mt-0.5 font-display text-lg">The next six things to ship.</h3>
        </div>
        <span className="text-[11px] text-muted">By due date</span>
      </header>
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {milestones.map((m, i) => {
          const t = TYPE[m.type] ?? TYPE.assignment;
          const Icon = t.Icon;
          const urgent = urgencyTone(m.daysAway);
          return (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/courses/${m.courseId}`)}
              className="group flex items-center gap-4 px-5 py-3.5 text-left transition hover:bg-white/[0.03]"
            >
              <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl border', t.className, urgent.ring)}>
                <Icon size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-alabaster">{m.title}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    {m.weight}% weight
                  </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-soft">{m.courseTitle}</div>
              </div>
              <div className="text-right">
                <div className={cn('text-xs font-semibold', urgent.label)}>{m.dueLabel}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted">
                  in {m.daysAway} day{m.daysAway === 1 ? '' : 's'}
                </div>
              </div>
              <ChevronRight size={14} className="text-muted opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
