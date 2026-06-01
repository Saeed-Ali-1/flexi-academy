import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

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
          <span className="font-semibold text-alabaster">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function VelocityChart({ data }) {
  const target = data[0]?.target ?? 12;
  return (
    <div className="glass-card p-5">
      <header className="mb-3">
        <div className="eyebrow">Velocity</div>
        <h3 className="mt-0.5 font-display text-lg">Lessons completed per week</h3>
        <p className="mt-1 text-xs text-muted-soft">Compared to the {target}/week target.</p>
      </header>
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" stroke="#8a93b0" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis stroke="#8a93b0" tickLine={false} axisLine={false} fontSize={11} width={28} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <ReferenceLine y={target} stroke="rgba(245,184,106,0.5)" strokeDasharray="4 4" />
            <Bar dataKey="lessons" fill="rgba(124,92,255,0.4)" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="lessons" stroke="#3ddcb2" strokeWidth={2.5} dot={{ fill: '#3ddcb2', r: 3 }} activeDot={{ r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
