import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar } from 'lucide-react'
import ScoreRing from '@/components/dashboard/ScoreRing'
import ProgressBreakdown from '@/components/dashboard/ProgressBreakdown'
import TodoWidget from '@/components/dashboard/TodoWidget'
import { useApplications } from '@/hooks/useApplication'
import { useScoreApplication } from '@/hooks/useEssayAnalysis'
import { usePrograms } from '@/hooks/usePrograms'
import useApplicationStore from '@/store/applicationStore'

export default function DashboardPage() {
  const { activeApplication } = useApplicationStore()
  const { data: applications = [], isLoading } = useApplications()
  const { data: programs = [] } = usePrograms()
  const { setActiveApplication } = useApplicationStore()
  const scoreMutation = useScoreApplication()
  useEffect(() => { document.title = 'Bosh sahifa | Admitly' }, [])

  // Auto-select first application if none is active
  useEffect(() => {
    if (!activeApplication && applications.length > 0) {
      setActiveApplication(applications[0])
    }
  }, [applications, activeApplication, setActiveApplication])

  // Recalculate score when active application changes
  useEffect(() => {
    if (activeApplication?.id) {
      scoreMutation.mutate(activeApplication.id)
    }
  }, [activeApplication?.id])

  const app = activeApplication

  if (isLoading) return <DashboardSkeleton />

  if (!app) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-2xl mb-2">🎓</p>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Dastur tanlanmagan</h2>
          <Link to="/programs" className="text-sm text-blue-600 hover:underline">
            Dasturlar ro'yxatiga o'ting →
          </Link>
        </div>
        <ProgramsSection programs={programs} applications={applications} />
      </div>
    )
  }

  const docs = app.documents || []
  const ready = docs.filter((d) => d.status === 'approved').length
  const total = docs.length

  const breakdown = scoreMutation.data?.breakdown || {}
  const matchScore = scoreMutation.data?.match_score ?? app.match_score ?? 0

  const deadline = app.program_deadline
    ? new Date(app.program_deadline).toLocaleDateString('uz-UZ')
    : '—'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{app.program_name}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{app.program_flag} Sizning arizangiz holati</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Mos kelish darajasi" value={`${matchScore}%`} sub="umumiy ball" />
        <StatCard
          label="Hujjatlar holati"
          value={`${ready}/${total}`}
          sub="hujjat tayyor"
        />
        <StatCard label="Deadline" value={deadline} sub="oxirgi sana" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score ring */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Umumiy mos kelish</CardTitle></CardHeader>
          <CardContent className="flex justify-center pb-6">
            <ScoreRing score={matchScore} />
          </CardContent>
        </Card>

        {/* Progress breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm">Mezonlar bo'yicha tahlil</CardTitle></CardHeader>
          <CardContent>
            <ProgressBreakdown breakdown={breakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Todo widget */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Navbatdagi vazifalar</CardTitle></CardHeader>
        <CardContent>
          <TodoWidget application={app} breakdown={breakdown} />
        </CardContent>
      </Card>

      {/* Programs section */}
      <ProgramsSection programs={programs} applications={applications} />
    </div>
  )
}

function ProgramsSection({ programs, applications }) {
  const appliedIds = new Set(applications.map((a) => a.program))
  const preview = programs.slice(0, 4)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Mavjud dasturlar</h2>
        <Link to="/programs" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          Barchasi <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {preview.map((p) => {
          const applied = appliedIds.has(p.id)
          const days = p.deadline
            ? Math.ceil((new Date(p.deadline) - new Date()) / 86400000)
            : null
          return (
            <Link key={p.id} to={`/programs/${p.id}`}>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
                <span className="text-xl leading-none">{p.flag_emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {days !== null && (
                      <span className={`text-xs ${days < 30 ? 'text-red-500' : 'text-gray-400'}`}>
                        <Calendar size={10} className="inline mr-0.5" />
                        {days > 0 ? `${days} kun` : 'Tugagan'}
                      </span>
                    )}
                    {p.min_ielts && (
                      <span className="text-xs text-gray-400">IELTS {p.min_ielts}+</span>
                    )}
                  </div>
                </div>
                {applied && (
                  <Badge variant="success" className="text-xs shrink-0">Ariza bor</Badge>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-48 col-span-2" />
      </div>
      <Skeleton className="h-40" />
    </div>
  )
}
