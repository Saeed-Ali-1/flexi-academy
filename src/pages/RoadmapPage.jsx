import { motion } from 'framer-motion';
import { CalendarRange, GraduationCap, Hourglass, Sparkles } from 'lucide-react';
import { useMoodleQuery } from '../hooks/useMoodleQuery.js';
import { getMoodleClient } from '../api/moodleClient.js';
import RadialProgress from '../components/ui/RadialProgress.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import YearTimeline from '../components/roadmap/YearTimeline.jsx';
import MilestoneList from '../components/roadmap/MilestoneList.jsx';
import StreakCalendar from '../components/roadmap/StreakCalendar.jsx';

function StatTile({ icon: Icon, label, value, sub, tone = 'iris' }) {
  const toneClass =
    tone === 'aurora'
      ? 'text-aurora-soft bg-aurora/10'
      : tone === 'amber'
        ? 'text-amber-warm bg-amber-warm/10'
        : 'text-iris-soft bg-iris/10';
  return (
    <div className="glass-card flex items-center gap-4 p-4">
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${toneClass}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
        <div className="font-display text-xl leading-tight text-alabaster">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-soft">{sub}</div>}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const { data: overview, isLoading } = useMoodleQuery(
    () => getMoodleClient().getYearOverview(),
    []
  );

  if (isLoading || !overview) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-4 h-44" />
        <Skeleton className="mt-6 h-72" />
      </div>
    );
  }

  const weeklyPct = Math.round((overview.studyHoursThisWeek / overview.studyHoursTarget) * 100);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <header className="mb-7 flex flex-col gap-2">
        <div className="eyebrow">Roadmap</div>
        <h1 className="heading-display">{overview.year}.</h1>
        <p className="max-w-2xl text-sm text-muted-soft">
          The full academic year on one canvas. Where every course is, what's coming up next, and
          whether you're keeping a healthy rhythm.
        </p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card grain flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex-1">
          <div className="eyebrow">Year-to-date</div>
          <h2 className="mt-2 font-display text-3xl leading-tight text-balance">
            You're <span className="bg-gradient-to-r from-iris-soft to-aurora bg-clip-text text-transparent">{overview.overallCompletion}%</span> of the way through {overview.year.split(' — ')[1] ?? 'this year'}.
          </h2>
          <p className="mt-2 text-sm text-muted-soft">
            {overview.completedLessons} of {overview.totalLessons} lessons done across all subjects.
            Week {overview.weeksElapsed} of {overview.weeksTotal} · {overview.daysToFinalExam} days to final assessments.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatTile
              icon={CalendarRange}
              label="This week"
              value={`${overview.studyHoursThisWeek}h`}
              sub={`${weeklyPct}% of ${overview.studyHoursTarget}h goal`}
              tone="aurora"
            />
            <StatTile
              icon={Hourglass}
              label="Days remaining"
              value={overview.daysToFinalExam}
              sub={`Until final assessments`}
              tone="amber"
            />
            <StatTile
              icon={GraduationCap}
              label="Active courses"
              value={overview.courseLanes.length}
              sub="All on track"
              tone="iris"
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-center">
          <RadialProgress
            value={overview.overallCompletion}
            size={180}
            strokeWidth={14}
            tone="iris"
            label="Year complete"
            sublabel={`W${overview.weeksElapsed}/${overview.weeksTotal}`}
          />
        </div>
      </motion.section>

      <section className="mt-7">
        <YearTimeline overview={overview} />
      </section>

      <section className="mt-7 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <MilestoneList milestones={overview.milestones} />
        <StreakCalendar streak={overview.streak} />
      </section>

      <footer className="mt-8 flex items-start gap-3 rounded-2xl border border-iris/20 bg-iris/[0.06] p-5">
        <Sparkles className="mt-0.5 shrink-0 text-iris-soft" size={18} />
        <div className="text-sm text-alabaster/90">
          <strong className="text-alabaster">You're tracking well.</strong> Across all 8 courses you're at {overview.overallCompletion}% with {overview.streak.currentDays} consecutive study days. The next pinch point is the Chemistry lab report in 3 days — block 90 minutes for it Thursday evening.
        </div>
      </footer>
    </div>
  );
}
