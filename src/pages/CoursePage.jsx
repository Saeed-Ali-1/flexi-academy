import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, GraduationCap, PlayCircle } from 'lucide-react';
import { useMoodleQuery } from '../hooks/useMoodleQuery.js';
import { getMoodleClient } from '../api/moodleClient.js';
import RadialProgress from '../components/ui/RadialProgress.jsx';
import Badge from '../components/ui/Badge.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import QuadmesterTimeline from '../components/roadmap/QuadmesterTimeline.jsx';
import UnitGrid from '../components/roadmap/UnitGrid.jsx';
import CompletionChart from '../components/roadmap/CompletionChart.jsx';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useMoodleQuery(
    () => getMoodleClient().getCourse(courseId),
    [courseId]
  );
  const [activeQ, setActiveQ] = useState(null);

  useEffect(() => {
    if (course && !activeQ) {
      const inProgress = course.quadmesters.find((q) => q.completion > 0 && q.completion < 100);
      setActiveQ(inProgress?.id ?? course.quadmesters[0]?.id);
    }
  }, [course, activeQ]);

  if (isLoading || !course) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-4 h-44" />
        <Skeleton className="mt-6 h-24" />
      </div>
    );
  }

  const activeQuadmester = course.quadmesters.find((q) => q.id === activeQ) ?? course.quadmesters[0];
  const nextLesson = course.nextLesson;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <button
        onClick={() => navigate('/library')}
        className="mb-5 inline-flex items-center gap-1.5 text-xs text-muted hover:text-alabaster"
      >
        <ChevronLeft size={14} /> Back to library
      </button>

      <section className="glass-card grain p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <Badge tone={course.accent}>{course.subject}</Badge>
            <h1 className="heading-display mt-3">{course.title}</h1>
            <p className="mt-2 text-sm text-muted-soft">{course.teacher} · {course.description}</p>
            {nextLesson && (
              <button
                onClick={() => navigate(`/courses/${course.id}/lessons/${nextLesson.id}`)}
                className="btn-primary mt-5"
              >
                <PlayCircle size={16} /> Resume: {nextLesson.title}
              </button>
            )}
          </div>
          <div className="flex shrink-0 items-center justify-center">
            <RadialProgress
              value={course.completion}
              size={180}
              strokeWidth={14}
              tone={course.accent}
              label="Course complete"
              sublabel={`${course.completedLessons ?? '—'}/${course.totalLessons ?? '—'} lessons`}
            />
          </div>
        </div>
      </section>

      <section className="mt-7">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <div className="eyebrow">Roadmap</div>
            <h2 className="mt-1 font-display text-2xl">Your year, at a glance.</h2>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted sm:flex">
            <GraduationCap size={14} className="text-iris-soft" />
            Tap a quadmester to explore its units.
          </div>
        </header>
        <QuadmesterTimeline quadmesters={course.quadmesters} activeId={activeQ} onSelect={setActiveQ} />
      </section>

      <section className="mt-7">
        <AnimatePresence mode="wait">
          {activeQuadmester && (
            <motion.div
              key={activeQuadmester.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <header className="mb-4 flex items-baseline justify-between">
                <div>
                  <div className="eyebrow">{activeQuadmester.label}</div>
                  <h3 className="mt-1 font-display text-xl">{activeQuadmester.title}</h3>
                </div>
                <div className="text-xs text-muted">{activeQuadmester.completion}% complete</div>
              </header>
              <UnitGrid units={activeQuadmester.units} courseId={course.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {course.pacing && (
        <section className="mt-8">
          <CompletionChart pacing={course.pacing} />
        </section>
      )}
    </div>
  );
}
