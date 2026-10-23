import { MainLayout } from '../layouts/MainLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { WelcomePage } from '../features/home/pages/WelcomePage'
import { LoginPage } from '../features/auth/pages/LoginPage'

function getPath() {
  return window.location.pathname || '/'
}

export function AppRoutes() {
  const path = getPath()

  if (path === '/') {
    return (
      <MainLayout>
        <WelcomePage />
      </MainLayout>
    )
  }

  if (path === '/login') {
    return (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    )
  }

  return null
}
