import { Flame, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/authStore.js';
import Avatar from '../ui/Avatar.jsx';

function timeOfDayGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Burning the midnight oil';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Late night session';
}

export default function ProfileHub() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card grain flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <Avatar size="lg" initials={user.avatarInitials} color={user.avatarColor} />
        <div>
          <div className="eyebrow">{timeOfDayGreeting()}</div>
          <h1 className="heading-display mt-0.5">{user.firstName}.</h1>
          <div className="mt-1 text-sm text-muted-soft">
            {user.programme} <span className="mx-1.5 text-white/20">·</span> {user.cohort}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-warm/15 text-amber-warm">
            <Flame size={16} />
          </span>
          <div>
            <div className="text-lg font-semibold text-alabaster">{user.streakDays} days</div>
            <div className="text-[10px] uppercase tracking-wide text-muted">Study streak</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-iris/15 text-iris-soft">
            <Sparkles size={16} />
          </span>
          <div>
            <div className="text-lg font-semibold text-alabaster">{user.xp.toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted">XP this term</div>
          </div>
        </div>
        <button className="btn-ghost">
          View progress <ArrowUpRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}
