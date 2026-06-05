import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'

const LEVEL_CONFIG = {
  critical: {
    icon: AlertCircle,
    color: 'border-red-200 bg-red-50',
    iconColor: 'text-red-500',
    badge: 'bg-red-100 text-red-700',
    label: 'Jiddiy xato',
  },
  warning: {
    icon: AlertTriangle,
    color: 'border-yellow-200 bg-yellow-50',
    iconColor: 'text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700',
    label: 'Tavsiya',
  },
  strength: {
    icon: CheckCircle2,
    color: 'border-green-200 bg-green-50',
    iconColor: 'text-green-500',
    badge: 'bg-green-100 text-green-700',
    label: 'Kuchli tomon',
  },
}

export default function AnnotationCard({ annotation, index }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = LEVEL_CONFIG[annotation.level] || LEVEL_CONFIG.warning
  const Icon = cfg.icon

  return (
    <div className={`rounded-lg border ${cfg.color} overflow-hidden`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left hover:brightness-95 transition-all"
      >
        <Icon size={18} className={`${cfg.iconColor} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.label}
            </span>
            <span className="text-xs text-gray-500">#{index + 1}</span>
          </div>
          <p className="text-xs text-gray-500 italic truncate">
            "…{annotation.text?.slice(0, 80)}{annotation.text?.length > 80 ? '…' : ''}"
          </p>
          {annotation.issue_uz && (
            <p className="text-sm text-gray-700 mt-1">{annotation.issue_uz}</p>
          )}
        </div>
        <div className="shrink-0 text-gray-400 mt-0.5">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 bg-white">
          {annotation.suggestion_uz && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">💡 Tavsiya</p>
              <p className="text-sm text-gray-700">{annotation.suggestion_uz}</p>
            </div>
          )}
          {annotation.improved_uz && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">✏️ Yaxshilangan variant</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3 border border-gray-200 leading-relaxed">
                {annotation.improved_uz}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
