import { type ReactNode } from 'react'
import { UiIcon } from '../shared/components/UiIcon'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="auth-layout__brand mx-auto mb-8 w-full max-w-6xl">
        <span className="brand__logo">
          <UiIcon name="logo" />
        </span>
        <div>
          <strong>Mi Diario</strong>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </div>
  )
}
