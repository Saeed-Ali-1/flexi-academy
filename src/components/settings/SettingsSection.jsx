import { cn } from '../../lib/classNames.js';

export default function SettingsSection({ id, title, description, icon: Icon, children, className }) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <header className="mb-4 flex items-start gap-3">
        {Icon && (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-iris-soft">
            <Icon size={18} />
          </span>
        )}
        <div>
          <h2 className="font-display text-xl leading-tight text-alabaster">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-soft">{description}</p>}
        </div>
      </header>
      <div className="glass-card p-5">{children}</div>
    </section>
  );
}
