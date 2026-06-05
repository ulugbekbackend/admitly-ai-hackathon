import { useRef } from 'react'
import { CheckCircle2, Clock, XCircle, Upload, FileText, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  approved: { icon: CheckCircle2, color: 'text-green-500', badge: 'success', label: 'Yuklandi ✓' },
  submitted: { icon: Clock, color: 'text-yellow-500', badge: 'warning', label: 'Jarayonda' },
  pending: { icon: XCircle, color: 'text-red-400', badge: 'destructive', label: 'Yuklanmagan' },
}

// Accept PDF, DOC, DOCX by extension
const ACCEPTED = '.pdf,.doc,.docx'

export default function ChecklistItem({ doc, onToggle, onUpload, loading, uploadingId }) {
  const cfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  const fileRef = useRef(null)
  const isUploading = uploadingId === doc.id

  const nextStatus = { pending: 'submitted', submitted: 'approved', approved: 'pending' }[doc.status]

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpload(doc.id, file)
    e.target.value = ''
  }

  // Prefer file_url (absolute URL from backend), fallback to file path
  const fileUrl = doc.file_url || doc.file || null
  const fileName = fileUrl
    ? decodeURIComponent(fileUrl.split('/').pop().split('?')[0])
    : null

  return (
    <div className={cn(
      'flex items-center gap-3 p-3.5 rounded-lg border bg-white transition-all',
      doc.status === 'approved'
        ? 'border-green-300 bg-green-50'
        : doc.status === 'submitted'
          ? 'border-yellow-200 bg-yellow-50/40'
          : 'border-gray-200 hover:border-gray-300',
    )}>
      {/* Status toggle */}
      <button
        onClick={() => onToggle(doc.id, nextStatus)}
        disabled={loading || isUploading}
        className="shrink-0 disabled:opacity-50"
        title="Holatni o'zgartirish"
      >
        <Icon size={22} className={cn(cfg.color, 'transition-colors')} />
      </button>

      {/* Doc info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          doc.status === 'approved' ? 'text-green-800' : 'text-gray-900'
        )}>
          {doc.doc_type}
        </p>
        {fileName && fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5 max-w-full truncate"
          >
            <FileText size={11} />
            {fileName}
          </a>
        )}
      </div>

      {/* Badge */}
      <Badge variant={cfg.badge} className="shrink-0 text-xs">{cfg.label}</Badge>

      {/* Upload button */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={isUploading}
        title="Fayl yuklash (PDF yoki DOCX)"
        className={cn(
          'shrink-0 p-1.5 rounded-md transition-colors disabled:opacity-50',
          doc.status === 'approved'
            ? 'text-green-600 hover:bg-green-100'
            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
        )}
      >
        {isUploading
          ? <Loader2 size={16} className="animate-spin text-blue-500" />
          : <Upload size={16} />
        }
      </button>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
