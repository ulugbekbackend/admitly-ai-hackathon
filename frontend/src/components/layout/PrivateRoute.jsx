import { Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

export default function PrivateRoute({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken)
  if (!accessToken) return <Navigate to="/login" replace />
  return children
}
