import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, redirectTo }) {
  const { isAuthenticated, isHydrated } = useAuth()
  const location = useLocation()
  const intended = redirectTo || (location.pathname + location.search)
  if (!isHydrated) return <div className="section-pad"><div className="container-premium"><p className="subtle">Loading secure workspace...</p></div></div>
  if (!isAuthenticated) return <Navigate to={`/auth?mode=signin&redirect=${encodeURIComponent(intended)}`} replace />
  return children
}
