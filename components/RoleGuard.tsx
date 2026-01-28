'use client'

import { useUserRoles } from '@/hooks/useUserRoles'
import { Badge } from '@/components/ui/badge'

export function UserRolesDisplay() {
  const { roles, isLoading } = useUserRoles()

  if (isLoading) {
    return <Badge variant="secondary">Cargando...</Badge>
  }

  if (roles.length === 0) {
    return <Badge variant="destructive">Sin rol</Badge>
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {roles.map((role) => (
        <Badge key={role.id} variant="default">
          {role.name}
        </Badge>
      ))}
    </div>
  )
}

interface RoleGuardProps {
  children: React.ReactNode
  requiredRoles: ('admin' | 'Caja' | 'Registrador')[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, requiredRoles, fallback }: RoleGuardProps) {
  const { hasAnyRole, isLoading } = useUserRoles()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (hasAnyRole(requiredRoles)) {
    return <>{children}</>
  }

  return fallback ? <>{fallback}</> : null
}
