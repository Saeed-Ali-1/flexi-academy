import { motion } from 'framer-motion';
import { cn } from '../../lib/classNames.js';

export default function Switch({ checked, onChange, label, description, disabled, id }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <div className="min-w-0 flex-1">
        {label && (
          <div className="text-sm font-semibold text-alabaster">{label}</div>
        )}
        {description && (
          <div className="mt-0.5 text-xs leading-relaxed text-muted-soft">{description}</div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        id={id}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition',
          checked ? 'border-iris/40 bg-iris/40' : 'border-white/10 bg-white/[0.05]'
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 480, damping: 30 }}
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full shadow-glow',
            checked ? 'left-[22px] bg-white' : 'left-0.5 bg-muted-soft'
          )}
        />
      </button>
    </label>
  );
}
