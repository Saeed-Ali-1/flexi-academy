import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/classNames.js';

export default function FieldWithValidation({
  label,
  type = 'text',
  value,
  onChange,
  validator,
  placeholder,
  autoComplete,
  name,
  required,
}) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!touched) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setError(validator ? validator(value) : null);
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [value, touched, validator]);

  const inputType = type === 'password' && revealed ? 'text' : type;

  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-muted-soft">{label}</span>
      )}
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-err` : undefined}
          className={cn('input-base', error && 'input-error', type === 'password' && 'pr-12')}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:bg-white/[0.06] hover:text-alabaster"
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            id={`${name}-err`}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-1.5 text-xs text-danger"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </label>
  );
}
