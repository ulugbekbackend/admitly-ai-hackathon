import { Progress } from '@/components/ui/progress'

const CRITERIA = [
  { key: 'gpa', label: 'GPA', weight: '20%' },
  { key: 'language', label: 'Til sertifikati', weight: '20%' },
  { key: 'experience', label: 'Tajriba', weight: '20%' },
  { key: 'essay', label: 'Esse', weight: '25%' },
  { key: 'recommendation', label: 'Tavsiya xati', weight: '15%' },
]

function barColor(val) {
  if (val >= 70) return 'bg-green-500'
  if (val >= 50) return 'bg-yellow-500'
  return 'bg-red-400'
}

export default function ProgressBreakdown({ breakdown = {} }) {
  return (
    <div className="space-y-3">
      {CRITERIA.map(({ key, label, weight }) => {
        const val = breakdown[key] ?? 0
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{weight}</span>
                <span className="text-sm font-semibold text-gray-800 w-9 text-right">{val}%</span>
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor(val)}`}
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
