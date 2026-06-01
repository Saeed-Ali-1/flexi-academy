import { cn } from '../../lib/classNames.js';

export default function Avatar({ initials, color = '#7c5cff', size = 'md', className }) {
  const sizeClass =
    size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-sm';
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white shadow-glow',
        sizeClass,
        className
      )}
      style={{ background: `linear-gradient(135deg, ${color}, ${shade(color, -25)})` }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0xff) + percent;
  let b = (num & 0xff) + percent;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
