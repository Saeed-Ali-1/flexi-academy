import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronLeft as Prev, Clock4, GraduationCap, Maximize2 } from 'lucide-react';
import { useMoodleQuery } from '../hooks/useMoodleQuery.js';
import { getMoodleClient } from '../api/moodleClient.js';
import { useUIStore } from '../lib/uiStore.js';
import LessonDrawer from '../components/lesson/LessonDrawer.jsx';
import ActivityBlock from '../components/lesson/ActivityBlock.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import Badge from '../components/ui/Badge.jsx';

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const focusMode = useUIStore((s) => s.focusMode);
  const toggleFocusMode = useUIStore((s) => s.toggleFocusMode);
  const closeNotifications = useUIStore((s) => s.closeNotifications);

  const { data: lesson, isLoading } = useMoodleQuery(
    () => getMoodleClient().getLesson(lessonId),
    [lessonId]
  );

  useEffect(() => {
    closeNotifications();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonId, closeNotifications]);

  if (isLoading || !lesson) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-4 h-12" />
        <Skeleton className="mt-6 h-64" />
      </div>
    );
  }

  const completed = lesson.activities.filter((a) => a.completion >= 100).length;

  return (
    <div className="flex">
      <LessonDrawer lesson={lesson} courseId={courseId} />

      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
          {!focusMode && (
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="mb-5 inline-flex items-center gap-1.5 text-xs text-muted hover:text-alabaster"
            >
              <ChevronLeft size={14} /> {lesson.courseTitle} · roadmap
            </button>
          )}

          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card grain p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide text-muted">
              <Badge tone="iris">{lesson.quadmester}</Badge>
              <span>·</span>
              <span>{lesson.unitTitle}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Clock4 size={11} /> {lesson.durationMin} min</span>
            </div>
            <h1 className="heading-display mt-3">{lesson.title}</h1>
            {lesson.subtitle && (
              <p className="mt-2 text-base text-muted-soft">{lesson.subtitle}</p>
            )}

            <div className="mt-5 flex items-end justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-muted">
                <GraduationCap size={13} className="text-iris-soft" />
                {lesson.teacher}
              </div>
              <div className="flex items-center gap-3">
                {!focusMode && (
                  <button
                    onClick={toggleFocusMode}
                    className="btn-ghost !py-2 !text-xs"
                    title="Hide chrome and focus on the lesson"
                  >
                    <Maximize2 size={14} /> Enter focus mode
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4">
              <ProgressBar
                value={Math.round((completed / lesson.activities.length) * 100)}
                tone="iris"
                size="md"
                label={`${completed} of ${lesson.activities.length} activities complete`}
              />
            </div>
          </motion.header>

          <div className="mt-6 flex flex-col gap-5">
            {lesson.activities.map((activity) => (
              <ActivityBlock
                key={activity.id}
                activity={activity}
                lessonId={lesson.id}
                onComplete={() => {}}
              />
            ))}
          </div>

          <nav className="mt-8 flex items-center justify-between gap-4 text-sm">
            {lesson.prev ? (
              <button
                onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.prev.id}`)}
                className="btn-ghost"
              >
                <Prev size={15} />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wide text-muted">Previous</div>
                  <div className="text-xs">{lesson.prev.title}</div>
                </div>
              </button>
            ) : (
              <span />
            )}
            {lesson.next && (
              <button
                onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.next.id}`)}
                className="btn-primary"
              >
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wide text-white/70">Up next</div>
                  <div className="text-xs">{lesson.next.title}</div>
                </div>
                <ChevronRight size={15} />
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
