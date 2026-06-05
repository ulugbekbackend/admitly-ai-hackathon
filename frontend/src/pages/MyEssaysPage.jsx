import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, FileText, Calendar, BarChart2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMyEssays } from '@/hooks/useEssayAnalysis'
import { Skeleton } from '@/components/ui/skeleton'
import AnnotatedText from '@/components/essay/AnnotatedText'
import AnnotationCard from '@/components/essay/AnnotationCard'
import { cn } from '@/lib/utils'

const LEVEL_COLOR = {
  strong: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  weak: 'bg-red-100 text-red-700 border-red-300',
}
const LEVEL_LABEL = { strong: 'Kuchli', medium: "O'rta", weak: 'Zaif' }

export default function MyEssaysPage() {
  const { data: essays = [], isLoading } = useMyEssays()
  const [expanded, setExpanded] = useState(null)
  useEffect(() => { document.title = 'Mening esseylarim | Admitly' }, [])

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mening esseylarim</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Barcha tahlil natijalari saqlanadi — {essays.length} ta esse
        </p>
      </div>

      {essays.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-56 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <FileText size={32} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Hali esse tahlil qilinmagan</p>
          <p className="text-xs text-gray-400 mt-1">Esse tahlili sahifasiga o'ting va birinchi esseyingizni kiriting</p>
        </div>
      ) : (
        <div className="space-y-3">
          {essays.map((essay) => (
            <EssayCard
              key={essay.id}
              essay={essay}
              isOpen={expanded === essay.id}
              onToggle={() => setExpanded(expanded === essay.id ? null : essay.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EssayCard({ essay, isOpen, onToggle }) {
  const criticals = essay.annotations?.filter((a) => a.level === 'critical') || []
  const warnings = essay.annotations?.filter((a) => a.level === 'warning') || []
  const strengths = essay.annotations?.filter((a) => a.level === 'strength') || []

  const date = new Date(essay.created_at).toLocaleString('uz-UZ', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })

  return (
    <Card className="overflow-hidden">
      {/* Summary row — always visible, clickable */}
      <button
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-base leading-none">{essay.program_flag}</span>
            <span className="text-sm font-semibold text-gray-900 truncate">{essay.program_name}</span>
            <Badge
              className={cn(
                'text-xs border',
                LEVEL_COLOR[essay.match_level] || LEVEL_COLOR.weak
              )}
              variant="outline"
            >
              {LEVEL_LABEL[essay.match_level] || essay.match_level}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar size={11} /> {date}
            </span>
            <span className="flex items-center gap-1">
              <BarChart2 size={11} /> Ball: <strong className="text-gray-800">{essay.overall_score}</strong>
            </span>
            <span>{essay.word_count} so'z</span>
            {criticals.length > 0 && <span className="text-red-500">🔴 {criticals.length} jiddiy</span>}
            {warnings.length > 0 && <span className="text-amber-500">🟡 {warnings.length} tavsiya</span>}
            {strengths.length > 0 && <span className="text-green-600">🟢 {strengths.length} kuchli</span>}
          </div>
        </div>

        {/* Score circle */}
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0',
          essay.overall_score >= 70 ? 'border-green-400 text-green-700 bg-green-50'
            : essay.overall_score >= 50 ? 'border-yellow-400 text-yellow-700 bg-yellow-50'
            : 'border-red-400 text-red-700 bg-red-50'
        )}>
          {essay.overall_score}
        </div>

        {isOpen ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
      </button>

      {/* Expanded detail */}
      {isOpen && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {/* Summary */}
          {essay.summary_uz && (
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Xulosa</p>
              <p className="text-sm text-gray-700 leading-relaxed">{essay.summary_uz}</p>
            </div>
          )}

          {/* Annotated text */}
          {essay.essay_text && essay.annotations?.length > 0 && (
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Belgilangan esse
                <span className="ml-1.5 font-normal text-gray-400">(rang ustiga suring — izoh ko'ring)</span>
              </p>
              <AnnotatedText text={essay.essay_text} annotations={essay.annotations} />
            </div>
          )}

          {/* Annotations list */}
          {essay.annotations?.length > 0 && (
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Batafsil izohlar</p>
              {criticals.map((a, i) => <AnnotationCard key={i} annotation={a} index={i} />)}
              {warnings.map((a, i) => <AnnotationCard key={i} annotation={a} index={criticals.length + i} />)}
              {strengths.map((a, i) => <AnnotationCard key={i} annotation={a} index={criticals.length + warnings.length + i} />)}
            </div>
          )}

          {/* Missing + strengths */}
          {(essay.missing_uz?.length > 0 || essay.strengths_uz?.length > 0) && (
            <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {essay.missing_uz?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-2">❌ Yetishmayotgan elementlar</p>
                  <ul className="space-y-1">
                    {essay.missing_uz.map((item, i) => (
                      <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                        <span className="text-red-400">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {essay.strengths_uz?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-2">✅ Kuchli tomonlar</p>
                  <ul className="space-y-1">
                    {essay.strengths_uz.map((item, i) => (
                      <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                        <span className="text-green-500">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
