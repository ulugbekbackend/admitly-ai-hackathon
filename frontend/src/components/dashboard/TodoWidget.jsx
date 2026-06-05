import { Link } from 'react-router-dom'
import { ArrowRight, FileText, BookOpen, Star, Award } from 'lucide-react'

function getTodos(application, breakdown) {
  const todos = []
  if (!application) {
    todos.push({ icon: Award, label: 'Dastur tanlang', to: '/dashboard', color: 'text-blue-600' })
    return todos
  }
  const b = breakdown || {}
  if ((b.essay ?? 0) < 50)
    todos.push({ icon: FileText, label: 'Esse yozing va tahlil qiling', to: '/essay', color: 'text-red-500' })
  if ((b.recommendation ?? 0) < 60)
    todos.push({ icon: Star, label: 'Tavsiya xati qo\'shing', to: '/checklist', color: 'text-yellow-600' })
  if ((b.language ?? 0) < 60)
    todos.push({ icon: BookOpen, label: 'IELTS/TOEFL sertifikatini kiriting', to: '/profile', color: 'text-purple-600' })

  const docs = application.documents || []
  const pending = docs.filter((d) => d.status === 'pending').length
  if (pending > 0)
    todos.push({ icon: FileText, label: `${pending} ta hujjat tugallanmagan`, to: '/checklist', color: 'text-orange-500' })

  if (todos.length === 0)
    todos.push({ icon: Award, label: 'Barcha asosiy vazifalar bajarildi!', to: '/dashboard', color: 'text-green-600' })

  return todos.slice(0, 4)
}

export default function TodoWidget({ application, breakdown }) {
  const todos = getTodos(application, breakdown)
  return (
    <ul className="space-y-2">
      {todos.map((todo, i) => {
        const Icon = todo.icon
        return (
          <li key={i}>
            <Link
              to={todo.to}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <Icon size={16} className={todo.color} />
              <span className="flex-1 text-sm text-gray-700">{todo.label}</span>
              <ArrowRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
