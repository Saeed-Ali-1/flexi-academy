import { cn } from '../../lib/classNames.js';

export default function Pill({ active, onClick, children, className, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('chip transition', active && 'chip-active', className)}
      aria-pressed={!!active}
      {...rest}
    >
      {children}
    </button>
  );
}
