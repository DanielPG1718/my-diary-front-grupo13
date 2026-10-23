import { UiIcon } from './UiIcon'

const sidebarItems = [
  { label: 'Bienvenida', href: '/', icon: 'home' as const },
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' as const },
  { label: 'Notas', href: '/diary', icon: 'diary' as const },
  { label: 'Crear nota', href: '/diary/create', icon: 'add' as const },
  { label: 'Perfil', href: '/profile', icon: 'profile' as const },
]

export function Sidebar() {
  return (
    <aside className="bg-transparent gap-4 space-y-4">
      <div className="sidebar__panel">
        <p className="eyebrow">Accesos rápidos</p>
        {sidebarItems.map((item) => (
          <a key={item.href} className="sidebar__item w-full" href={item.href}>
            <UiIcon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
      <div className="sidebar__panel flex justify-center">
        <img
          src="/image_chica_gato.png"
          alt="Chica con gato"
          className="w-full max-w-xs h-auto object-contain"
        />
      </div>
    </aside>
  )
}
