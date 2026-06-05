import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import {
  ArrowLeft, ExternalLink, Calendar, Award, GraduationCap,
  CheckCircle2, Circle, Loader2, BookOpen, Clock
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useProgram } from '@/hooks/usePrograms'
import { useApplications, useCreateApplication } from '@/hooks/useApplication'
import { useApplication } from '@/hooks/useApplication'
import useApplicationStore from '@/store/applicationStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function deadlineDays(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000)
}

export default function ProgramDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: program, isLoading } = useProgram(id)
  const { data: applications = [] } = useApplications()
  const { setActiveApplication } = useApplicationStore()
  const createApplication = useCreateApplication()
  useEffect(() => {
    document.title = program?.name ? `${program.name} | Admitly` : 'Dastur | Admitly'
  }, [program?.name])

  const existingApp = applications.find((a) => a.program === Number(id))
  const { data: fullApp } = useApplication(existingApp?.id)

  const docStatusMap = {}
  if (fullApp?.documents) {
    fullApp.documents.forEach((d) => { docStatusMap[d.doc_type] = d.status })
  }

  const handleApply = () => {
    if (existingApp) {
      setActiveApplication(existingApp)
      toast.success('Ariza tanlandi!')
      navigate('/checklist')
      return
    }
    createApplication.mutate(Number(id), {
      onSuccess: (app) => {
        setActiveApplication(app)
        queryClient.invalidateQueries({ queryKey: ['applications'] })
        toast.success('Ariza muvaffaqiyatli yaratildi!')
        navigate('/checklist')
      },
      onError: () => toast.error('Ariza yaratishda xatolik'),
    })
  }

  if (isLoading) return <DetailSkeleton />

  if (!program) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Dastur topilmadi.</p>
        <Link to="/programs" className="text-blue-600 text-sm hover:underline mt-2 inline-block">← Orqaga</Link>
      </div>
    )
  }

  const days = deadlineDays(program.deadline)
  const deadlineLabel = program.deadline
    ? new Date(program.deadline).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const totalDocs = program.required_documents?.length || 0
  const doneDocs = program.required_documents?.filter((d) => docStatusMap[d] === 'approved').length || 0

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back link */}
      <Link to="/programs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={15} /> Dasturlar ro'yxatiga qaytish
      </Link>

      {/* Header card */}
      <Card>
        <CardContent className="pt-5 pb-5 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{program.flag_emoji}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{program.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{program.country}</p>
              </div>
            </div>
            <Badge
              variant={program.type === 'grant' ? 'default' : 'secondary'}
              className="text-xs px-2.5 py-1 shrink-0"
            >
              {program.type === 'grant'
                ? <><Award size={11} className="mr-1" />Grant</>
                : <><GraduationCap size={11} className="mr-1" />Universitet</>
              }
            </Badge>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-sm">
            {deadlineLabel && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar size={14} />
                <span>{deadlineLabel}</span>
                {days !== null && (
                  <span className={`font-semibold ml-1 ${days < 30 ? 'text-red-500' : days < 90 ? 'text-amber-500' : 'text-green-600'}`}>
                    ({days > 0 ? `${days} kun qoldi` : 'Muddati o\'tgan'})
                  </span>
                )}
              </div>
            )}
            {program.min_gpa && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <BookOpen size={14} />
                <span>Min GPA: <strong>{program.min_gpa}</strong></span>
              </div>
            )}
            {program.min_ielts && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock size={14} />
                <span>Min IELTS: <strong>{program.min_ielts}</strong></span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap pt-1">
            <Button
              onClick={handleApply}
              disabled={createApplication.isPending}
              className="gap-2"
            >
              {createApplication.isPending
                ? <><Loader2 size={14} className="animate-spin" /> Yaratilmoqda...</>
                : existingApp
                  ? '📋 Hujjatlarimga o\'tish'
                  : '🚀 Ariza boshlash'
              }
            </Button>
            {program.website && (
              <a href={program.website} target="_blank" rel="noreferrer">
                <Button variant="outline" className="gap-2">
                  <ExternalLink size={14} /> Rasmiy sayt
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {program.description && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Dastur haqida</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">{program.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Required documents todo list */}
      {program.required_documents?.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Zarur hujjatlar</CardTitle>
              {existingApp && (
                <span className="text-xs text-gray-500 font-normal">
                  {doneDocs}/{totalDocs} tayyor
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {program.required_documents.map((doc, i) => {
                const docStatus = docStatusMap[doc]
                return (
                  <li key={i} className="flex items-center gap-3">
                    {docStatus === 'approved' ? (
                      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    ) : docStatus === 'submitted' ? (
                      <CheckCircle2 size={18} className="text-yellow-400 shrink-0" />
                    ) : (
                      <Circle size={18} className="text-gray-300 shrink-0" />
                    )}
                    <span className={`text-sm ${
                      docStatus === 'approved'
                        ? 'text-green-700 line-through decoration-green-400'
                        : docStatus === 'submitted'
                          ? 'text-yellow-700'
                          : 'text-gray-700'
                    }`}>
                      {doc}
                    </span>
                    {docStatus === 'submitted' && (
                      <span className="text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded ml-auto">
                        Ko'rib chiqilmoqda
                      </span>
                    )}
                    {docStatus === 'approved' && (
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-auto">
                        Tayyor ✓
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>

            {!existingApp && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-2">
                  Hujjat holatini ko'rish uchun ariza boshlang
                </p>
                <Button size="sm" variant="outline" onClick={handleApply}>
                  Ariza boshlash
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="max-w-3xl space-y-6">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
