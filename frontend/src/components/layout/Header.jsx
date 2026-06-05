import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, User, Menu, Zap, Coins } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()

  const isPremium = user?.plan === 'premium'
  const credits = user?.credits ?? 0
  const lowCredits = !isPremium && credits <= 1

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-gray-900 md:hidden">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* Plan badge */}
        {user && (
          isPremium ? (
            <span className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
              <Zap size={11} />
              Premium
            </span>
          ) : (
            <Link
              to="/pricing"
              className={cn(
                'hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border transition-colors',
                lowCredits
                  ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
              )}
            >
              <Coins size={11} />
              {lowCredits ? `${credits} kredit` : `${credits} kr`}
            </Link>
          )
        )}

        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <User size={15} />
          <span className="max-w-[140px] truncate">{user?.full_name || user?.email || ''}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-gray-600 text-xs md:text-sm">
          <LogOut size={14} />
          <span className="hidden sm:inline">Chiqish</span>
        </Button>
      </div>
    </header>
  )
}
