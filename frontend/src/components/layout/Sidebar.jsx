import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, FileText, User, CreditCard, Globe, BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useApplicationStore from '@/store/applicationStore'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/programs', icon: Globe, label: 'Dasturlar' },
  { to: '/checklist', icon: CheckSquare, label: 'Hujjatlar' },
  { to: '/essay', icon: FileText, label: 'Esse tahlili' },
  { to: '/my-essays', icon: BookOpen, label: 'Mening esseylarim' },
  { to: '/profile', icon: User, label: 'Profil' },
  { to: '/pricing', icon: CreditCard, label: 'Tariflar' },
]

export default function Sidebar({ onClose }) {
  const { activeApplication } = useApplicationStore()

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">Admitly</span>
        <p className="text-xs text-gray-500 mt-0.5">Xalqaro grant platformasi</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Active program indicator */}
      {activeApplication && (
        <div className="p-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 px-2 mb-1">Faol ariza</p>
          <NavLink
            to="/checklist"
            onClick={onClose}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-base leading-none">{activeApplication.program_flag}</span>
            <span className="text-xs text-gray-700 font-medium truncate">
              {activeApplication.program_name}
            </span>
          </NavLink>
        </div>
      )}
    </aside>
  )
}
