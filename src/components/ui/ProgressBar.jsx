import { cn } from '../../lib/classNames.js';

export default function ProgressBar({
  value = 0,
  label,
  showPercent = true,
  tone = 'iris',
  size = 'md',
  className,
}) {
  const pct = Math.max(0, Math.min(100, value));
  const toneClass =
    tone === 'aurora'
      ? 'bg-aurora-gradient shadow-glow-aurora'
      : tone === 'amber'
        ? 'bg-amber-warm'
        : 'bg-iris-gradient shadow-glow';
  const heightClass = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2.5' : 'h-1.5';

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="text-muted-soft">{label}</span>}
          {showPercent && <span className="font-semibold text-alabaster">{pct}%</span>}
        </div>
      )}
      <div
        className={cn('w-full overflow-hidden rounded-full bg-white/[0.06]', heightClass)}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-700 ease-out', toneClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
