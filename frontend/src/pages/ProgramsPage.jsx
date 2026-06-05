import { Link } from 'react-router-dom'
import { Calendar, GraduationCap, Award, ArrowRight, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePrograms } from '@/hooks/usePrograms'
import { Skeleton } from '@/components/ui/skeleton'

function deadlineDays(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
  return diff
}

export default function ProgramsPage() {
  const { data: programs = [], isLoading } = usePrograms()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  useEffect(() => { document.title = 'Dasturlar | Admitly' }, [])

  const filtered = programs.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.type === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dasturlar</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Xalqaro grant va universitetlar ro'yxati — dastur kartasiga bosing
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            placeholder="Dastur yoki mamlakat nomi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {[['all', 'Barchasi'], ['grant', 'Grant'], ['university', 'Universitet']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filter === val
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => <ProgramCard key={p.id} program={p} />)}
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 py-16">Hech narsa topilmadi</p>
          )}
        </div>
      )}
    </div>
  )
}

function ProgramCard({ program: p }) {
  const days = deadlineDays(p.deadline)
  const deadlineLabel = p.deadline
    ? new Date(p.deadline).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <Link to={`/programs/${p.id}`}>
      <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
        <CardContent className="pt-5 pb-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl leading-none">{p.flag_emoji}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
                  {p.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{p.country}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant={p.type === 'grant' ? 'default' : 'secondary'} className="text-xs">
                {p.type === 'grant' ? <><Award size={10} className="mr-1" />Grant</> : <><GraduationCap size={10} className="mr-1" />Universitet</>}
              </Badge>
            </div>
          </div>

          {/* Min requirements */}
          <div className="flex gap-4 text-xs text-gray-500">
            {p.min_gpa && <span>GPA ≥ {p.min_gpa}</span>}
            {p.min_ielts && <span>IELTS ≥ {p.min_ielts}</span>}
          </div>

          {/* Deadline */}
          {deadlineLabel && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={12} />
                <span>{deadlineLabel}</span>
              </div>
              {days !== null && (
                <span className={`text-xs font-medium ${days < 30 ? 'text-red-500' : days < 90 ? 'text-amber-500' : 'text-green-600'}`}>
                  {days > 0 ? `${days} kun qoldi` : "Muddati o'tgan"}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-end text-xs text-blue-600 font-medium gap-1 pt-1">
            Batafsil <ArrowRight size={13} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
