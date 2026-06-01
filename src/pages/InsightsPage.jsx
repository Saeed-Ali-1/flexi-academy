import { useMoodleQuery } from '../hooks/useMoodleQuery.js';
import { getMoodleClient } from '../api/moodleClient.js';
import SummaryTile from '../components/insights/SummaryTile.jsx';
import TimeSpentChart from '../components/insights/TimeSpentChart.jsx';
import VelocityChart from '../components/insights/VelocityChart.jsx';
import SubjectStrengthChart from '../components/insights/SubjectStrengthChart.jsx';
import ActivityBreakdown from '../components/insights/ActivityBreakdown.jsx';
import StudyHeatmap from '../components/insights/StudyHeatmap.jsx';
import TipsList from '../components/insights/TipsList.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';

function fmtHM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function InsightsPage() {
  const { data, isLoading } = useMoodleQuery(() => getMoodleClient().getInsights(), []);

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Skeleton className="h-10 w-48" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="mt-6 h-64" />
      </div>
    );
  }

  const s = data.summary;
  const studyDelta = Math.round(((s.weeklyStudyMinutes - s.weeklyStudyMinutesPrev) / s.weeklyStudyMinutesPrev) * 100);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <header className="mb-7">
        <div className="eyebrow">Insights</div>
        <h1 className="heading-display mt-1">How you're learning.</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-soft">
          Trends from the last 7 days — what you spent time on, where you're strong, and the three
          things worth doing this week.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile
          label="Study time"
          value={fmtHM(s.weeklyStudyMinutes)}
          delta={studyDelta}
          sub={`Target ${fmtHM(s.weeklyStudyTarget)}`}
          tone="iris"
        />
        <SummaryTile
          label="Lessons completed"
          value={s.lessonsCompleted7d}
          delta={s.lessonsCompleted7d - s.lessonsCompleted7dPrev}
          sub="In the last 7 days"
          tone="aurora"
        />
        <SummaryTile
          label="Average score"
          value={`${s.avgScore}%`}
          delta={s.avgScore - s.avgScorePrev}
          sub="Across checks & quizzes"
          tone="amber"
        />
        <SummaryTile
          label="Focus sessions"
          value={s.focusSessions7d}
          delta={s.focusSessions7d - s.focusSessionsPrev}
          sub="Deep-focus blocks"
          tone="iris"
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <TimeSpentChart data={data.timeSpentByDay} />
        <VelocityChart data={data.velocity} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <SubjectStrengthChart data={data.subjectStrengths} />
        <ActivityBreakdown data={data.activityBreakdown} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <StudyHeatmap heatmap={data.studyHeatmap} />
        <TipsList tips={data.tips} />
      </section>
    </div>
  );
}
