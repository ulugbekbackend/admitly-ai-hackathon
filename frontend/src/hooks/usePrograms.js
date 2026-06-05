import { useQuery } from '@tanstack/react-query'
import { programsApi } from '@/api/programs'

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: () => programsApi.list().then((r) => r.data.results ?? r.data),
    staleTime: 10 * 60 * 1000,
  })
}

export function useProgram(id) {
  return useQuery({
    queryKey: ['programs', id],
    queryFn: () => programsApi.get(id).then((r) => r.data),
    enabled: !!id,
  })
}
