import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

function deltaTone(delta, inverted) {
  if (delta === 0) return { Icon: Minus, className: 'text-muted' };
  const positive = inverted ? delta < 0 : delta > 0;
  return positive
    ? { Icon: TrendingUp, className: 'text-aurora-soft' }
    : { Icon: TrendingDown, className: 'text-danger' };
}

export default function SummaryTile({ label, value, suffix, delta, inverted, sub, tone = 'iris' }) {
  const accentClass =
    tone === 'aurora'
      ? 'from-aurora/20 to-transparent'
      : tone === 'amber'
        ? 'from-amber-warm/20 to-transparent'
        : 'from-iris/20 to-transparent';
  const trend = deltaTone(delta ?? 0, inverted);
  const TIcon = trend.Icon;
  const formattedDelta =
    typeof delta === 'number' ? (delta >= 0 ? `+${delta}` : `${delta}`) : null;

  return (
    <div className={cn('glass-card relative overflow-hidden p-5')}>
      <div className={cn('pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b', accentClass)} />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-display text-3xl leading-none text-alabaster">{value}</span>
          {suffix && <span className="text-xs text-muted-soft">{suffix}</span>}
        </div>
        {formattedDelta && (
          <div className={cn('mt-2 inline-flex items-center gap-1 text-xs font-semibold', trend.className)}>
            <TIcon size={13} /> {formattedDelta}
            <span className="font-normal text-muted">vs. last week</span>
          </div>
        )}
        {sub && <div className="mt-1 text-xs text-muted-soft">{sub}</div>}
      </div>
    </div>
  );
}
