import { useEffect, useState } from 'react'
import { authService } from '../../features/auth/services/auth.service'
import { storageService } from '../../features/auth/services/storage.service'
import { UiIcon } from './UiIcon'

type NavbarProps = {
  title?: string
}

const navItems = [
  { label: 'Inicio', href: '/', icon: 'home' as const },
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' as const },
  { label: 'Mis notas', href: '/diary', icon: 'diary' as const },
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
    <header className="workspace-sidebar">
      <a className="workspace-brand" href="/">
        <span className="workspace-brand__icon"><UiIcon name="diary" /></span>
        <span><strong>{title}</strong><small>Tu espacio personal</small></span>
      </a>
      <nav className="workspace-nav" aria-label="Principal">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}
            className={`workspace-nav__link ${currentPath === item.href ? 'is-active' : ''}`}
            aria-current={currentPath === item.href ? 'page' : undefined}>
            <UiIcon name={item.icon} /><span>{item.label}</span>
          </a>
        ))}
      </nav>
      <a className="workspace-button workspace-sidebar__create" href="/diary/create">
        <UiIcon name="add" /> Nueva nota
      </a>
      <div className="workspace-sidebar__art">
        <img src="/design/student.png" alt="Ilustración de un chico con su portátil y su diario" />

      </div>
      <div className="workspace-sidebar__account">
        {user ? (
          <>
            {boardPreview ? <div className="workspace-goal"><UiIcon name="note" /><span>Meta: {boardPreview}</span></div> : null}
            <a className="workspace-user" href="/profile">
              <span className="workspace-avatar">{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
              <span><strong>{user.firstName} {user.lastName}</strong><small>{user.email || 'Mi perfil personal'}</small></span>
              <UiIcon name="profile" />
            </a>
            <button type="button" className="workspace-logout" onClick={handleLogout}>
              <UiIcon name="logout" /> Cerrar sesión
            </button>
          </>
        ) : null}
      </div>
    </header>
  )
}
