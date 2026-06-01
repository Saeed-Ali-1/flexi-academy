import { cn } from '../../lib/classNames.js';

const TONES = {
  iris: 'border-iris/40 bg-iris/15 text-iris-soft',
  aurora: 'border-aurora/40 bg-aurora/15 text-aurora-soft',
  amber: 'border-amber-warm/40 bg-amber-warm/15 text-amber-warm',
  muted: 'border-white/10 bg-white/[0.04] text-muted-soft',
  danger: 'border-danger/40 bg-danger/15 text-danger',
};

export default function Badge({ tone = 'muted', children, className, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        TONES[tone] ?? TONES.muted,
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
