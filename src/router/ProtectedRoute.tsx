import { useAuth } from '@/store/auth.store'
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { loggedIn } = useAuth()

  if (!loggedIn) {
    return <Navigate to="/validacion-cut" replace />
  }

  return children
}
