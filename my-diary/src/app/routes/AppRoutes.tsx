import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { DiaryListPage } from '../features/diary/pages/DiaryListPage'
import { DiaryCreatePage } from '../features/diary/pages/DiaryCreatePage'
import { DiaryEditPage } from '../features/diary/pages/DiaryEditPage'
import { DiaryDetailPage } from '../features/diary/pages/DiaryDetailPage'
import { AuthGuard } from '../core/guards/AuthGuard'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { ProfilePage } from '../features/profile/pages/ProfilePage'
import { ProfileEditPage } from '../features/profile/pages/ProfileEditPage'
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

  if (path === '/register') {
    return (
      <AuthLayout>
        <RegisterPage />
      </AuthLayout>
    )
  }

  if (path === '/forgot-password') {
    return (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    )
  }

  if (path === '/profile' || path === '/profile/edit') {
    return (
      <MainLayout>
        <AuthGuard>
          {path === '/profile' ? <ProfilePage /> : <ProfileEditPage />}
        </AuthGuard>
      </MainLayout>
    )
  }

  if (path === '/diary' || path === '/diary/create' || path === '/diary/edit' || path === '/diary/detail') {
    return (
      <MainLayout>
        <AuthGuard>
          {path === '/diary' ? (
            <DiaryListPage />
          ) : path === '/diary/create' ? (
            <DiaryCreatePage />
          ) : path === '/diary/edit' ? (
            <DiaryEditPage />
          ) : (
            <DiaryDetailPage />
          )}
        </AuthGuard>
      </MainLayout>
    )
  }

  if (path === '/dashboard') {
    return (
      <MainLayout>
        <AuthGuard>
          <DashboardPage />
        </AuthGuard>
      </MainLayout>
    )
  }

  return null
}
