import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Compass, Settings, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

const ITEMS = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/roadmap', icon: Compass, label: 'Roadmap' },
  { to: '/insights', icon: BarChart3, label: 'Insights' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function SideRail() {
  return (
    <nav className="hidden w-[88px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.05] bg-midnight/60 py-6 lg:flex">
      {ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'group flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-xl text-muted-soft transition hover:bg-white/[0.05] hover:text-alabaster',
              isActive && 'bg-iris/15 text-alabaster shadow-glow'
            )
          }
        >
          <Icon size={18} />
          <span className="text-[9px] uppercase tracking-wide">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
