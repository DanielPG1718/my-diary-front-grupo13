import { type ReactNode } from 'react'
import { storageService } from '../../features/auth/services/storage.service'

type AuthGuardProps = {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const token = storageService.getToken()

  if (!token) {
    return (
      <div className="guard-card">
        <h1>Acceso restringido</h1>
        <p>Inicia sesión para continuar en dashboard, notas y perfil.</p>
        <a className="button button--primary" href="/login">
          Ir al login
        </a>
      </div>
    )
  }

  return <>{children}</>
}
