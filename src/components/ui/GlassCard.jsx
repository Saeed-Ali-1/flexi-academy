import { cn } from '../../lib/classNames.js';

export default function GlassCard({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cn('glass-card', className)} {...rest}>
      {children}
    </Tag>
  );
}
