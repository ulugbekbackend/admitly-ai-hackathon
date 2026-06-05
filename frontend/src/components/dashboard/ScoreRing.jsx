const SIZE = 120
const STROKE = 10
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

function ringColor(score) {
  if (score >= 70) return '#16a34a'
  if (score >= 50) return '#ca8a04'
  return '#dc2626'
}

export default function ScoreRing({ score = 0, label = 'Mos kelish' }) {
  const pct = Math.min(100, Math.max(0, score))
  const offset = CIRC - (pct / 100) * CIRC
  const color = ringColor(pct)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none" stroke="#e5e7eb" strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none" stroke={color} strokeWidth={STROKE}
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{pct}%</span>
        </div>
      </div>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )
}
