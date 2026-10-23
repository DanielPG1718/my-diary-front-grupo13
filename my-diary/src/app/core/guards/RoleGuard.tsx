import { type ReactNode } from 'react'
import { storageService } from '../../features/auth/services/storage.service'

type RoleGuardProps = {
  allowedRoles: string[]
  children: ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = storageService.getUser()

  if (!user || !user.roles || !user.roles.some(role => allowedRoles.includes(role))) {
    return <div>No tienes permisos para ver este contenido.</div>
  }

  return <>{children}</>
}
