import { motion } from 'framer-motion';
import { cn } from '../../lib/classNames.js';

export default function RadialProgress({
  value = 0,
  size = 160,
  strokeWidth = 12,
  tone = 'iris',
  label,
  sublabel,
  className,
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const gradId = `rp-${tone}`;
  const colors =
    tone === 'aurora'
      ? ['#3ddcb2', '#1fb893']
      : tone === 'amber'
        ? ['#f5b86a', '#e89640']
        : ['#7c5cff', '#5a3fd8'];
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-alabaster">{pct}%</span>
        {label && <span className="eyebrow mt-1">{label}</span>}
        {sublabel && <span className="mt-0.5 text-xs text-muted">{sublabel}</span>}
      </div>
    </div>
  );
}
