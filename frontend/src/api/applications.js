import client from './client'
import { TOKEN_KEY } from '@/lib/constants'

export const applicationsApi = {
  list: () => client.get('/applications/'),
  create: (programId) => client.post('/applications/', { program: programId }),
  get: (id) => client.get(`/applications/${id}/`),
  update: (id, data) => client.patch(`/applications/${id}/`, data),
  documents: (id) => client.get(`/applications/${id}/documents/`),
  addDocument: (id, data) => client.post(`/applications/${id}/documents/`, data),
  updateDocument: (docId, data) => client.patch(`/applications/documents/${docId}/`, data),
  uploadDocument: async (docId, file) => {
    const token = localStorage.getItem(TOKEN_KEY)
    const form = new FormData()
    form.append('file', file)
    form.append('status', 'approved')

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/applications/documents/${docId}/`,
      {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      }
    )

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: 'Yuklashda xatolik' }))
      const error = new Error(errData.detail || 'Upload failed')
      error.response = { data: errData, status: res.status }
      throw error
    }

    return { data: await res.json() }
  },
}
