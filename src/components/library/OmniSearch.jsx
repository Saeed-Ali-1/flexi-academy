import { Search, X } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

export default function OmniSearch({ value, onChange, placeholder = 'Search courses, teachers, subjects…', className }) {
  return (
    <div className={cn('relative', className)}>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
        <Search size={16} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base h-12 pl-11 pr-10 text-base"
        aria-label="Search library"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:bg-white/[0.06] hover:text-alabaster"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
