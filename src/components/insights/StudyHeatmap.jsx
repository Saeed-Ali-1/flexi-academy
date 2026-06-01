import { motion } from 'framer-motion';
import { cn } from '../../lib/classNames.js';

const LEVELS = [
  'bg-white/[0.04] border-white/[0.05]',
  'bg-iris/15 border-iris/20',
  'bg-iris/30 border-iris/30',
  'bg-iris/55 border-iris/40',
  'bg-iris-gradient border-iris/50 shadow-glow',
];

export default function StudyHeatmap({ heatmap }) {
  const { rows, cols, matrix } = heatmap;
  let peakValue = 0;
  let peakRow = '';
  let peakCol = '';
  matrix.forEach((r, i) => r.forEach((v, j) => {
    if (v > peakValue) { peakValue = v; peakRow = rows[i]; peakCol = cols[j]; }
  }));

  return (
    <div className="glass-card p-5">
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <div className="eyebrow">Study patterns</div>
          <h3 className="mt-0.5 font-display text-lg">When you focus best</h3>
        </div>
        <span className="rounded-full border border-iris/30 bg-iris/10 px-2.5 py-1 text-[11px] font-semibold text-iris-soft">
          Peak: {peakRow} {peakCol}
        </span>
      </header>

      <div className="overflow-x-auto">
        <div className="inline-grid min-w-full" style={{ gridTemplateColumns: `60px repeat(${cols.length}, minmax(40px, 1fr))` }}>
          <span />
          {cols.map((c) => (
            <div key={c} className="pb-2 text-center text-[10px] uppercase tracking-wide text-muted">
              {c}
            </div>
          ))}
          {rows.map((r, i) => (
            <div key={r} className="contents">
              <div className="flex items-center pr-3 text-[11px] font-medium text-muted-soft">{r}</div>
              {matrix[i].map((v, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (i + j) * 0.02, duration: 0.25 }}
                  title={`${r} ${cols[j]}: intensity ${v}/4`}
                  className={cn('m-0.5 aspect-square rounded-md border', LEVELS[Math.min(v, 4)])}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-muted">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className={cn('h-2.5 w-2.5 rounded-sm border', LEVELS[l])} />
        ))}
        <span>More</span>
      </footer>
    </div>
  );
}
