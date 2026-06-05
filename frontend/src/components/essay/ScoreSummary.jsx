import ScoreRing from '@/components/dashboard/ScoreRing'
import ProgressBreakdown from '@/components/dashboard/ProgressBreakdown'

const LEVEL_CONFIG = {
  strong: { label: 'Kuchli', color: 'text-green-600 bg-green-50 border-green-200' },
  medium: { label: "O'rtacha", color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  weak: { label: 'Kuchsiz', color: 'text-red-600 bg-red-50 border-red-200' },
}

export default function ScoreSummary({ analysis }) {
  const { overall_score, match_level, word_count, annotations = [], breakdown = {}, summary_uz } = analysis
  const issues = annotations.filter((a) => a.level !== 'strength').length
  const cfg = LEVEL_CONFIG[match_level] || LEVEL_CONFIG.weak

  return (
    <div className="space-y-6">
      {/* 3 stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Umumiy ball" value={`${overall_score}/100`} />
        <StatCard label="So'z soni" value={word_count} />
        <StatCard label="Muammolar" value={issues} highlight={issues > 3} />
      </div>

      {/* Match level badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${cfg.color}`}>
        Dasturga mos kelish: {cfg.label}
      </div>

      {/* Summary */}
      {summary_uz && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">Umumiy baholash</p>
          <p className="text-sm text-gray-700 leading-relaxed">{summary_uz}</p>
        </div>
      )}

      {/* Score ring + breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex justify-center">
          <ScoreRing score={overall_score} label="Essay ball" />
        </div>
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-700 mb-3">Mezonlar bo'yicha tahlil</p>
          <ProgressBreakdown breakdown={breakdown} />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}
