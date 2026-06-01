import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar.jsx';
import Badge from '../ui/Badge.jsx';

const ACCENT_BG = {
  iris: 'from-iris/35 via-iris/10 to-transparent',
  aurora: 'from-aurora/30 via-aurora/10 to-transparent',
  amber: 'from-amber-warm/30 via-amber-warm/10 to-transparent',
};

const ACCENT_GLYPH = {
  Chemistry: '⚗',
  Mathematics: '∑',
  English: '✎',
  History: '◐',
  Biology: '☘',
  Physics: '⚛',
  Economics: '$',
  Arabic: 'ع',
};

const CourseCard = forwardRef(function CourseCard({ course, index = 0 }, ref) {
  const navigate = useNavigate();
  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.35 }}
      onClick={() => navigate(`/courses/${course.id}`)}
      className="glass-card group grain relative flex flex-col overflow-hidden p-0 text-left transition hover:border-iris/30 hover:shadow-glow"
    >
      <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${ACCENT_BG[course.accent] ?? ACCENT_BG.iris}`}>
        <span className="absolute inset-0 grid place-items-center font-display text-[7rem] leading-none text-white/10">
          {ACCENT_GLYPH[course.subject] ?? '◆'}
        </span>
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge tone={course.accent}>{course.category}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs text-muted">{course.subject}</div>
        <h3 className="mt-0.5 font-display text-xl leading-tight text-alabaster">{course.title}</h3>
        <div className="mt-1 text-xs text-muted-soft">{course.teacher}</div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-soft">{course.description}</p>

        <div className="mt-auto pt-5">
          <ProgressBar value={course.completion} tone={course.accent} size="sm" label="Progress" />
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted">
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-iris-soft opacity-0 transition group-hover:opacity-100">
              Open <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>

      {course.completion >= 80 && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-aurora/30 bg-aurora/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-aurora-soft">
          <Sparkles size={10} /> On track
        </span>
      )}
    </motion.button>
  );
});

export default CourseCard;
