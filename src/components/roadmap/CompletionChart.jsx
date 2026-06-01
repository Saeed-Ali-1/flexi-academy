import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel min-w-[140px] p-3 text-xs">
      <div className="mb-1 font-semibold text-alabaster">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 capitalize text-muted-soft">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} /> {p.dataKey}
          </span>
          <span className="font-semibold text-alabaster">{p.value} lessons</span>
        </div>
      ))}
    </div>
  );
}

export default function CompletionChart({ pacing }) {
  return (
    <div className="glass-card p-5">
      <header className="mb-2">
        <div className="eyebrow">Pacing</div>
        <h3 className="mt-1 font-display text-xl">Your pace vs. class pace</h3>
        <p className="mt-1 text-xs text-muted-soft">
          Lessons completed each week. Class pace is the required cumulative target.
        </p>
      </header>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={pacing} margin={{ top: 18, right: 12, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="grad-required" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-actual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ddcb2" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#3ddcb2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" stroke="#8a93b0" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis stroke="#8a93b0" tickLine={false} axisLine={false} fontSize={11} width={28} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
              iconType="circle"
              formatter={(v) => <span className="capitalize text-muted-soft">{v}</span>}
            />
            <Area type="monotone" dataKey="required" stroke="#7c5cff" strokeWidth={2} fill="url(#grad-required)" />
            <Area type="monotone" dataKey="actual" stroke="#3ddcb2" strokeWidth={2} fill="url(#grad-actual)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
