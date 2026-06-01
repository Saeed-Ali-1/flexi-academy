import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, PlayCircle, PanelLeftClose, PanelLeftOpen, Clock4 } from 'lucide-react';
import { useUIStore } from '../../lib/uiStore.js';
import { cn } from '../../lib/classNames.js';

function LessonRow({ lesson, courseId, isCurrent }) {
  const navigate = useNavigate();
  const Icon = lesson.completion >= 100 ? CheckCircle2 : lesson.completion > 0 ? PlayCircle : Circle;
  return (
    <button
      onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition',
        isCurrent
          ? 'border-iris/40 bg-iris/10 shadow-glow'
          : 'border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]'
      )}
    >
      <motion.span
        key={lesson.completion}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className={cn(
          'mt-0.5',
          lesson.completion >= 100
            ? 'text-aurora-soft'
            : lesson.completion > 0
              ? 'text-iris-soft'
              : 'text-muted'
        )}
      >
        <Icon size={17} />
      </motion.span>
      <div className="min-w-0 flex-1">
        <div className={cn('text-sm leading-tight', isCurrent ? 'font-semibold text-alabaster' : 'text-alabaster/90')}>
          {lesson.title}
        </div>
        <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted">
          <Clock4 size={11} /> {lesson.durationMin} min
          {lesson.completion > 0 && lesson.completion < 100 && (
            <span className="ml-1.5 text-iris-soft">· {lesson.completion}%</span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function LessonDrawer({ lesson, courseId }) {
  const open = useUIStore((s) => s.lessonDrawerOpen);
  const toggle = useUIStore((s) => s.toggleLessonDrawer);
  const focusMode = useUIStore((s) => s.focusMode);

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.aside
          key="drawer-open"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'sticky shrink-0 overflow-hidden',
            focusMode ? 'top-0 h-screen' : 'top-[64px] h-[calc(100vh-64px)]'
          )}
        >
          <div className="flex h-full w-[300px] flex-col border-r border-white/[0.06] bg-slate-deep/60 backdrop-blur-xl">
            <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted">{lesson.quadmester}</div>
                <div className="font-display text-sm leading-tight text-alabaster">{lesson.unitTitle}</div>
              </div>
              <button
                onClick={toggle}
                aria-label="Hide lesson rail"
                className="rounded-lg p-1.5 text-muted hover:bg-white/[0.05] hover:text-alabaster"
              >
                <PanelLeftClose size={16} />
              </button>
            </header>
            <div className="flex flex-col gap-1 overflow-y-auto p-2">
              {lesson.siblings.map((l) => (
                <LessonRow key={l.id} lesson={l} courseId={courseId} isCurrent={l.id === lesson.id} />
              ))}
            </div>
          </div>
        </motion.aside>
      ) : (
        <motion.button
          key="drawer-closed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggle}
          className={cn(
            'btn-icon sticky h-10 w-10 self-start',
            focusMode ? 'top-4 ml-4 mt-4' : 'top-[80px] ml-4'
          )}
          aria-label="Show lesson rail"
        >
          <PanelLeftOpen size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
