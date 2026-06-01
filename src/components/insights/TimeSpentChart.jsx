import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip, CartesianGrid } from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const min = payload[0].value;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return (
    <div className="glass-panel p-3 text-xs">
      <div className="font-semibold text-alabaster">{label}</div>
      <div className="mt-0.5 text-muted-soft">
        {h > 0 ? `${h}h ${m}m` : `${m}m`}
      </div>
    </div>
  );
}

export default function TimeSpentChart({ data }) {
  const max = Math.max(...data.map((d) => d.minutes));
  return (
    <div className="glass-card p-5">
      <header className="mb-3">
        <div className="eyebrow">Time spent</div>
        <h3 className="mt-0.5 font-display text-lg">This week, by day</h3>
      </header>
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="ts-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c5cff" />
                <stop offset="100%" stopColor="#3ddcb2" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" stroke="#8a93b0" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis stroke="#8a93b0" tickLine={false} axisLine={false} fontSize={11} width={32} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.minutes === max ? 'url(#ts-grad)' : 'rgba(124,92,255,0.55)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
