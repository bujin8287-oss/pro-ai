import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // 如果用户角色不在允许的角色列表中，重定向到对应的主页
    switch (user.role) {
      case UserRole.OPERATIONS:
        return <Navigate to="/operations" replace />
      case UserRole.SALES:
        return <Navigate to="/sales" replace />
      case UserRole.SALES_CENTER:
        return <Navigate to="/sales-center" replace />
    }
  }

  return <>{children}</>
}
