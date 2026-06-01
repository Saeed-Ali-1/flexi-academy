import { useEffect, useState } from 'react';
import { cn } from '../../lib/classNames.js';

export default function SettingsNav({ items }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 1] }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav className="glass-card sticky top-24 flex flex-col gap-0.5 p-3" aria-label="Settings sections">
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = it.id === active;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(it.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition',
              isActive
                ? 'bg-iris/15 text-alabaster shadow-glow'
                : 'text-muted-soft hover:bg-white/[0.04] hover:text-alabaster'
            )}
          >
            <Icon size={15} />
            {it.label}
          </a>
        );
      })}
    </nav>
  );
}
