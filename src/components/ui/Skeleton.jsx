import { cn } from '../../lib/classNames.js';

export default function Skeleton({ className, ...rest }) {
  return (
    <div
      className={cn(
        'animate-pulse-soft rounded-lg bg-white/[0.05]',
        className
      )}
      {...rest}
    />
  );
}
