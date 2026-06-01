import Pill from '../ui/Pill.jsx';

export default function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pill active={active === 'all'} onClick={() => onChange('all')}>
        All
      </Pill>
      {categories.map((c) => (
        <Pill key={c} active={active === c} onClick={() => onChange(c)}>
          {c}
        </Pill>
      ))}
    </div>
  );
}
