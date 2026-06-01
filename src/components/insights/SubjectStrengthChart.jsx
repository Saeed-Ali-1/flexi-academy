import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;
  return (
    <div className="glass-panel min-w-[140px] p-3 text-xs">
      <div className="font-semibold text-alabaster">{item.subject}</div>
      <div className="mt-0.5 text-muted-soft">{item.score}% · {item.growth}</div>
    </div>
  );
}

export default function SubjectStrengthChart({ data }) {
  return (
    <div className="glass-card p-5">
      <header className="mb-2">
        <div className="eyebrow">Strengths & gaps</div>
        <h3 className="mt-0.5 font-display text-lg">Where you shine, where to look</h3>
      </header>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <RadarChart data={data} outerRadius="75%">
            <defs>
              <linearGradient id="radar-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#3ddcb2" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.07)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#aab2cc', fontSize: 11 }} />
            <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<ChartTooltip />} />
            <Radar
              dataKey="score"
              stroke="#7c5cff"
              strokeWidth={2}
              fill="url(#radar-fill)"
              fillOpacity={1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
