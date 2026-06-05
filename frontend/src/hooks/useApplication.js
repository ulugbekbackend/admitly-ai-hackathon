import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/api/applications'

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: () => applicationsApi.list().then((r) => r.data.results ?? r.data),
  })
}

export function useApplication(id) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => applicationsApi.get(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (programId) => applicationsApi.create(programId).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ docId, data }) => applicationsApi.updateDocument(docId, data).then((r) => r.data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications', applicationId] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ docId, file }) => applicationsApi.uploadDocument(docId, file).then((r) => r.data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications', applicationId] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
