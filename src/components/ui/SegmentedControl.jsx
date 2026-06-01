import { motion } from 'framer-motion';
import { cn } from '../../lib/classNames.js';

export default function SegmentedControl({ value, options, onChange, ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-xl border border-white/[0.06] bg-white/[0.03] p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              'relative rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              active ? 'text-alabaster' : 'text-muted hover:text-alabaster'
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${ariaLabel}`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-lg bg-iris/15 shadow-glow"
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
