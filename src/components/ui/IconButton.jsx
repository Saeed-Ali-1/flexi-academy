import { forwardRef } from 'react';
import { cn } from '../../lib/classNames.js';

const IconButton = forwardRef(function IconButton(
  { children, className, label, active, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'btn-icon',
        active && 'border-iris/40 bg-iris/10 text-alabaster',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
export default IconButton;
