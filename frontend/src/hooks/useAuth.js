import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth'
import useAuthStore from '@/store/authStore'

export function useAuth() {
  const { setTokens, logout, accessToken } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me().then((r) => r.data),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: (data) => authApi.login(data).then((r) => r.data),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Xush kelibsiz!')
      navigate('/dashboard')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data) => authApi.register(data).then((r) => r.data),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Ro\'yxatdan muvaffaqiyatli o\'tdingiz!')
      navigate('/dashboard')
    },
  })

  const handleLogout = () => {
    logout()
    queryClient.clear()
    toast.success('Tizimdan chiqildi')
    navigate('/login')
  }

  return {
    user,
    userLoading,
    login: loginMutation.mutate,
    loginPending: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerPending: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: handleLogout,
    isAuthenticated: !!accessToken,
  }
}
