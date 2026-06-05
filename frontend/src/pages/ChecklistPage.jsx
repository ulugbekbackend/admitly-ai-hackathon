import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DocumentChecklist from '@/components/checklist/DocumentChecklist'
import { useApplications, useApplication, useUpdateDocument, useUploadDocument } from '@/hooks/useApplication'
import { applicationsApi } from '@/api/applications'
import useApplicationStore from '@/store/applicationStore'
import { useQueryClient } from '@tanstack/react-query'

export default function ChecklistPage() {
  const { activeApplication, setActiveApplication } = useApplicationStore()
  const { data: applications = [], isLoading: appsLoading } = useApplications()
  const queryClient = useQueryClient()
  const updateDoc = useUpdateDocument()
  const uploadDoc = useUploadDocument()
  useEffect(() => { document.title = 'Hujjatlar | Admitly' }, [])

  // Auto-select first if none
  useEffect(() => {
    if (!activeApplication && applications.length > 0) {
      setActiveApplication(applications[0])
    }
  }, [applications, activeApplication, setActiveApplication])

  const app = activeApplication
  const { data: fullApp, isLoading: appLoading } = useApplication(app?.id)

  // On first load: sync required_documents from program into Document records
  const [synced, setSynced] = useState(false)
  useEffect(() => {
    if (!fullApp || synced) return
    setSynced(true)
    const existing = (fullApp.documents || []).map((d) => d.doc_type)
    const required = fullApp.required_documents || []
    if (required.length === 0) return

    const missing = required.filter((r) => !existing.includes(r))
    missing.forEach((docType) => {
      applicationsApi.addDocument(fullApp.id, { doc_type: docType, status: 'pending' }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['applications', fullApp.id] })
      })
    })
  }, [fullApp, synced, queryClient])

  const handleToggle = (docId, newStatus) => {
    updateDoc.mutate(
      { docId, data: { status: newStatus }, applicationId: app?.id },
      {
        onSuccess: () => toast.success('Holat yangilandi'),
        onError: () => toast.error('Xatolik yuz berdi'),
      }
    )
  }

  const handleUpload = (docId, file) => {
    uploadDoc.mutate(
      { docId, file, applicationId: app?.id },
      {
        onSuccess: () => toast.success(`${file.name} muvaffaqiyatli yuklandi`),
        onError: (err) => {
          const msg = err?.response?.data?.file?.[0] || err?.response?.data?.detail || 'Yuklashda xatolik'
          toast.error(msg)
        },
      }
    )
  }

  const docs = fullApp?.documents || []
  const ready = docs.filter((d) => d.status === 'approved').length

  if (appsLoading) return <p className="text-gray-400">Yuklanmoqda...</p>

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-2xl mb-2">📋</p>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Dastur tanlanmagan</h2>
        <p className="text-sm text-gray-500">Yon paneldagi "Dastur tanlash" tugmasini bosing</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{fullApp?.program_name || app.program_name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Talab qilinadigan hujjatlar ro'yxati</p>
        </div>
        <Badge variant={ready === docs.length && docs.length > 0 ? 'success' : 'secondary'} className="text-sm px-3 py-1">
          {ready}/{docs.length} tayyor
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">
            Belgiga bosing — holat o'zgartiring · 📎 tugmasi — fayl yuklang (PDF/DOCX)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentChecklist
            documents={docs}
            onToggle={handleToggle}
            onUpload={handleUpload}
            loading={updateDoc.isPending}
            uploadingId={uploadDoc.isPending ? uploadDoc.variables?.docId : null}
            isLoading={appLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
