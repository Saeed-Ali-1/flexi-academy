import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useMoodleQuery } from '../../hooks/useMoodleQuery.js';
import { getMoodleClient } from '../../api/moodleClient.js';
import ProgressBar from '../ui/ProgressBar.jsx';
import Badge from '../ui/Badge.jsx';
import Skeleton from '../ui/Skeleton.jsx';

export default function NextUpCards() {
  const navigate = useNavigate();
  const { data, isLoading } = useMoodleQuery(() => getMoodleClient().getCourses({}), []);
  const top = (data ?? []).slice(0, 3);

  return (
    <section>
      <header className="mb-4 flex items-end justify-between">
        <div>
          <div className="eyebrow">Pick up where you left off</div>
          <h2 className="mt-1 font-display text-2xl">Today's focus</h2>
        </div>
        <button onClick={() => navigate('/library')} className="text-sm text-muted-soft hover:text-alabaster">
          See all courses →
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading
          ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-44" />)
          : top.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/courses/${c.id}/lessons/${c.nextLesson.id}`)}
                className="glass-card group relative grain flex flex-col p-5 text-left transition hover:border-iris/30 hover:shadow-glow"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge tone={c.accent}>{c.subject}</Badge>
                  <PlayCircle size={18} className="text-muted opacity-60 transition group-hover:text-iris-soft group-hover:opacity-100" />
                </div>
                <div className="text-xs text-muted">Next lesson</div>
                <div className="mt-0.5 font-display text-lg leading-tight text-alabaster">
                  {c.nextLesson.title}
                </div>
                <div className="mt-1 text-xs text-muted-soft">{c.title}</div>
                <div className="mt-auto pt-4">
                  <ProgressBar value={c.completion} tone={c.accent} size="sm" showPercent={false} label={null} />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                    <span>{c.completedLessons}/{c.totalLessons} lessons</span>
                    <span className="inline-flex items-center gap-1 text-iris-soft">
                      Resume <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
      </div>
    </section>
  );
}
