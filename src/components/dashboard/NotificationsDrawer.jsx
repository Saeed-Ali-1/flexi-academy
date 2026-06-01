import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, BookOpen, CheckCircle2, Info } from 'lucide-react';
import Drawer from '../ui/Drawer.jsx';
import { useUIStore } from '../../lib/uiStore.js';
import { useMoodleQuery } from '../../hooks/useMoodleQuery.js';
import { getMoodleClient } from '../../api/moodleClient.js';
import { cn } from '../../lib/classNames.js';

const SEVERITY_ICON = {
  info: { Icon: Info, className: 'text-iris-soft bg-iris/10' },
  warning: { Icon: AlertCircle, className: 'text-amber-warm bg-amber-warm/10' },
  success: { Icon: CheckCircle2, className: 'text-aurora-soft bg-aurora/10' },
};

function NotificationRow({ title, body, timeAgo, severity, courseTitle }) {
  const tone = SEVERITY_ICON[severity] ?? SEVERITY_ICON.info;
  const Icon = tone.Icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-white/[0.06] hover:bg-white/[0.03]"
    >
      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', tone.className)}>
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-semibold text-alabaster">{title}</div>
          <div className="shrink-0 text-[11px] text-muted">{timeAgo}</div>
        </div>
        {courseTitle && (
          <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted">
            <BookOpen size={11} /> {courseTitle}
          </div>
        )}
        <p className="mt-1 text-xs leading-relaxed text-muted-soft">{body}</p>
      </div>
    </motion.div>
  );
}

export default function NotificationsDrawer() {
  const open = useUIStore((s) => s.notificationsOpen);
  const close = useUIStore((s) => s.closeNotifications);
  const { data } = useMoodleQuery(() => getMoodleClient().getNotifications(), [open], {
    initialData: { admin: [], courses: [] },
  });

  const [tab, setTab] = useState('all');
  const all = [...(data?.admin ?? []), ...(data?.courses ?? [])];
  const list = tab === 'admin' ? data?.admin ?? [] : tab === 'courses' ? data?.courses ?? [] : all;

  return (
    <Drawer open={open} onClose={close} title="Notifications">
      <div className="flex gap-1.5 border-b border-white/[0.06] px-5 py-3">
        {[
          { id: 'all', label: 'All', count: all.length },
          { id: 'admin', label: 'Admin', count: data?.admin?.length ?? 0 },
          { id: 'courses', label: 'Courses', count: data?.courses?.length ?? 0 },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              tab === t.id
                ? 'bg-iris/15 text-alabaster shadow-glow'
                : 'text-muted hover:text-alabaster'
            )}
          >
            {t.label}{' '}
            <span className="ml-1 text-[10px] text-muted">{t.count}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1 px-2 py-3">
        {list.map((n) => (
          <NotificationRow key={n.id} {...n} />
        ))}
        {list.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-muted">All caught up.</div>
        )}
      </div>
    </Drawer>
  );
}
