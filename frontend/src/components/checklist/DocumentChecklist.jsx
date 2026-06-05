import ChecklistItem from './ChecklistItem'
import { Skeleton } from '@/components/ui/skeleton'

export default function DocumentChecklist({ documents = [], onToggle, onUpload, loading, uploadingId, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <p className="text-center text-gray-400 py-10">
        Hujjatlar yo'q. Avval dastur tanlang.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <ChecklistItem
          key={doc.id}
          doc={doc}
          onToggle={onToggle}
          onUpload={onUpload}
          loading={loading}
          uploadingId={uploadingId}
        />
      ))}
    </div>
  )
}
