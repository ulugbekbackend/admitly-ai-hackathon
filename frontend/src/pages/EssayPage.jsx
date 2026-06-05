import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FileText, BarChart2, Loader2, AlertTriangle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import EssayEditor from '@/components/essay/EssayEditor'
import AnnotatedText from '@/components/essay/AnnotatedText'
import AnnotationCard from '@/components/essay/AnnotationCard'
import ScoreSummary from '@/components/essay/ScoreSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEssayAnalysis } from '@/hooks/useEssayAnalysis'
import useApplicationStore from '@/store/applicationStore'
import { useApplications } from '@/hooks/useApplication'

const TABS = [
  { key: 'editor', label: 'Esse kiriting', icon: FileText },
  { key: 'results', label: 'Natijalar', icon: BarChart2 },
]

export default function EssayPage() {
  const [tab, setTab] = useState('editor')
  const [essayText, setEssayText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  useEffect(() => { document.title = 'Esse tahlili | Admitly' }, [])

  const { user } = useAuth()
  const { activeApplication } = useApplicationStore()
  const { data: applications = [] } = useApplications()
  const essayMutation = useEssayAnalysis()

  const app = activeApplication || applications[0] || null
  const credits = user?.credits ?? 0
  const noCredits = credits <= 0

  const handleAnalyze = (text) => {
    if (!app) {
      toast.error('Avval yon paneldan dastur tanlang')
      return
    }
    setEssayText(text)
    essayMutation.mutate(
      { applicationId: app.id, essayText: text },
      {
        onSuccess: (data) => {
          setAnalysis(data)
          setTab('results')
          toast.success('Esse muvaffaqiyatli tahlil qilindi!')
        },
        onError: (err) => {
          const msg = err?.response?.data?.detail || 'Tahlil qilishda xatolik yuz berdi'
          toast.error(msg)
        },
      }
    )
  }

  const criticals = analysis?.annotations?.filter((a) => a.level === 'critical') || []
  const warnings = analysis?.annotations?.filter((a) => a.level === 'warning') || []
  const strengths = analysis?.annotations?.filter((a) => a.level === 'strength') || []

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Esse tahlili</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {app ? `${app.program_flag || ''} ${app.program_name}` : 'Dastur tanlanmagan'}
        </p>
      </div>

      {/* No-credits banner */}
      {noCredits && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-red-700">Kredit tugadi</p>
            <p className="text-red-600 mt-0.5">Esse tahlili uchun kredit yetarli emas. Qo'shimcha kredit sotib oling yoki Premium tarifga o'ting.</p>
          </div>
          <Link
            to="/pricing"
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 shrink-0"
          >
            <Zap size={12} />
            Upgrade
          </Link>
        </div>
      )}

      {/* Low-credit warning */}
      {!noCredits && credits === 1 && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm">
          <AlertTriangle size={16} className="text-yellow-500 shrink-0" />
          <span className="text-yellow-700">Faqat <strong>1 kredit</strong> qoldi. So'nggi tahlildan keyin kredit sotib oling yoki Premium tarifga o'ting.</span>
          <Link to="/pricing" className="ml-auto text-xs font-semibold text-amber-600 hover:underline shrink-0">
            Kredit olish →
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            disabled={key === 'results' && !analysis}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              tab === key
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <Icon size={15} />
            {label}
            {key === 'results' && analysis && (
              <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5">
                {analysis.overall_score}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Editor tab */}
      {tab === 'editor' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Motivatsion xatingizni quyida kiriting
            </CardTitle>
          </CardHeader>
          <CardContent>
            {essayMutation.isPending ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 size={36} className="animate-spin text-blue-600" />
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-800">AI tahlil qilyapti...</p>
                  <p className="text-sm text-gray-500 mt-1">Bu 15-30 soniya vaqt olishi mumkin</p>
                </div>
              </div>
            ) : (
              <EssayEditor
                onAnalyze={handleAnalyze}
                isPending={essayMutation.isPending}
                disabled={!app || noCredits}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Results tab */}
      {tab === 'results' && analysis && (
        <div className="space-y-6">
          {/* Score summary */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Tahlil natijalari</CardTitle></CardHeader>
            <CardContent>
              <ScoreSummary analysis={analysis} />
            </CardContent>
          </Card>

          {/* Annotated essay */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Belgilangan esse
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (rang ustiga suring — izoh ko'ring)
                </span>
              </CardTitle>
              <div className="flex gap-3 mt-2 flex-wrap">
                <LegendBadge color="bg-red-100 border-red-400" label={`🔴 Jiddiy: ${criticals.length}`} />
                <LegendBadge color="bg-yellow-100 border-yellow-400" label={`🟡 Tavsiya: ${warnings.length}`} />
                <LegendBadge color="bg-green-100 border-green-400" label={`🟢 Kuchli: ${strengths.length}`} />
              </div>
            </CardHeader>
            <CardContent>
              <AnnotatedText text={essayText} annotations={analysis.annotations} />
            </CardContent>
          </Card>

          {/* Annotation cards */}
          {analysis.annotations?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Batafsil izohlar</h3>

              {criticals.length > 0 && (
                <Section title="🔴 Jiddiy xatolar" items={criticals} offset={0} />
              )}
              {warnings.length > 0 && (
                <Section title="🟡 Tavsiyalar" items={warnings} offset={criticals.length} />
              )}
              {strengths.length > 0 && (
                <Section title="🟢 Kuchli tomonlar" items={strengths} offset={criticals.length + warnings.length} />
              )}
            </div>
          )}

          {/* Missing + strengths lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.missing_uz?.length > 0 && (
              <Card className="border-red-200">
                <CardHeader><CardTitle className="text-sm text-red-700">❌ Yetishmayotgan elementlar</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {analysis.missing_uz.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-red-400 shrink-0">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {analysis.strengths_uz?.length > 0 && (
              <Card className="border-green-200">
                <CardHeader><CardTitle className="text-sm text-green-700">✅ Kuchli tomonlar</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {analysis.strengths_uz.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-green-500 shrink-0">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, items, offset }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((a, i) => (
          <AnnotationCard key={i} annotation={a} index={offset + i} />
        ))}
      </div>
    </div>
  )
}

function LegendBadge({ color, label }) {
  return (
    <span className={`text-xs px-2 py-1 rounded border ${color}`}>{label}</span>
  )
}
