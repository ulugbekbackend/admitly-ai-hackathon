import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { essaysApi } from '@/api/essays'

export function useEssayAnalysis() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId, essayText }) =>
      essaysApi.analyze(applicationId, essayText).then((r) => r.data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications', applicationId] })
    },
  })
}

export function useMyEssays() {
  return useQuery({
    queryKey: ['my-essays'],
    queryFn: () => essaysApi.myEssays().then((r) => r.data),
  })
}

export function useScoreApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId) => essaysApi.score(applicationId).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}
