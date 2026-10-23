import { useEffect, useState } from 'react'
import { authService } from '../../features/auth/services/auth.service'
import { storageService } from '../../features/auth/services/storage.service'
import { UiIcon } from './UiIcon'

type NavbarProps = {
  title?: string
}

const navItems = [
  { label: 'Home', href: '/', icon: 'home' as const },
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' as const },
  { label: 'Notas', href: '/diary', icon: 'diary' as const },
  { label: 'Perfil', href: '/profile', icon: 'profile' as const },
]

export function Navbar({ title = 'Mi Diario' }: NavbarProps) {
  const user = storageService.getUser()
  const currentPath = window.location.pathname
  const boardStorageKey = user?.id ? `my-diary-board-goal:${user.id}` : 'my-diary-board-goal:guest'
  const [boardGoal, setBoardGoal] = useState('')

  useEffect(() => {
    const readBoardGoal = () => {
      if (!user?.id) {
        setBoardGoal('')
        return
      }

      setBoardGoal(window.localStorage.getItem(boardStorageKey) ?? '')
    }

    readBoardGoal()

    const handleBoardUpdate = () => readBoardGoal()
    window.addEventListener('my-diary-board-updated', handleBoardUpdate)
    window.addEventListener('storage', handleBoardUpdate)

    return () => {
      window.removeEventListener('my-diary-board-updated', handleBoardUpdate)
      window.removeEventListener('storage', handleBoardUpdate)
    }
  }, [boardStorageKey, user?.id])

  const boardPreview = boardGoal.trim().length > 42 ? `${boardGoal.trim().slice(0, 42)}…` : boardGoal.trim()

  const handleLogout = () => {
    authService.logout()
    window.location.href = '/login'
  }

  return (
    <header className="navbar">
      <a className="brand" href="/">
        <span className="brand__logo">
          <UiIcon name="logo" />
        </span>
        <span>
          <strong>{title}</strong>
          <small>Notas, clima, moneda y más</small>
        </span>
      </a>

      <nav className="navbar__links" aria-label="Principal">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`nav-link ${currentPath === item.href ? 'nav-link--active' : ''}`}
            aria-current={currentPath === item.href ? 'page' : undefined}
          >
            <UiIcon name={item.icon} />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="navbar__actions">
        {user ? (
          <>
            {boardPreview ? (
              <div className="hidden rounded-full border border-[#c3aee9] bg-[#e1d6f4] px-4 py-2 text-sm font-medium text-[#1e1e69] shadow-sm lg:flex lg:items-center lg:gap-2">
                <UiIcon name="note" />
                <span className="max-w-[260px] truncate">Meta: {boardPreview}</span>
              </div>
            ) : null}
            <div className="user-chip">
              <UiIcon name="profile" />
              <span>
                {user.firstName} {user.lastName}
              </span>
            </div>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              <UiIcon name="logout" />
              Logout
            </button>
          </>
        ) : null}
      </div>
    </header>
  )
}
