type UiIconName =
  | 'logo'
  | 'home'
  | 'dashboard'
  | 'diary'
  | 'history'
  | 'profile'
  | 'logout'
  | 'login'
  | 'register'
  | 'forgot'
  | 'add'
  | 'edit'
  | 'eye'
  | 'search'
  | 'calendar'
  | 'lock'
  | 'mail'
  | 'note'
  | 'weather'
  | 'currency'
  | 'stats'
  | 'notification'
  | 'menu'
  | 'arrow-right'
  | 'arrow-left'
  | 'palette'
  | 'settings'
  | 'heart'
  | 'trash'
  | 'camera'

type UiIconProps = {
  name: UiIconName
}

const iconPaths: Record<UiIconName, string> = {
  logo: 'M6 4h8l4 6-4 10H6L2 10z M9 7h2l2 3-2 4H9L7 10z',
  home: 'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
  dashboard: 'M4 5h6v6H4zm10 0h6v10h-6zM4 13h6v6H4zm10 12V15h6v10z',
  diary: 'M6 4h11a2 2 0 0 1 2 2v16H8a2 2 0 0 1-2-2zM8 8h8M8 12h8M8 16h5',
  history: 'M12 3a9 9 0 1 1-6.36 2.64M6 4v4h4',
  profile: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 9a7 7 0 0 1 14 0',
  logout: 'M10 17l5-5-5-5M15 12H4M18 4h2v16h-2',
  login: 'M14 5h4v14h-4M10 8l4 4-4 4M14 12H4',
  register: 'M6 20h12M8 4h8l4 4v12H8zM12 8v6M9 11h6',
  forgot: 'M12 18h.01M9.09 9a3 3 0 1 1 4.95 2.24c-.84.7-1.54 1.28-1.54 2.76v.5',
  add: 'M12 5v14M5 12h14',
  edit: 'M4 20h4l10-10-4-4L4 16zM14 6l4 4',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6zm10 2.5A2.5 2.5 0 1 0 9.5 12 2.5 2.5 0 0 0 12 14.5z',
  search: 'M11 4a7 7 0 1 1-4.95 11.95L3 20l1.4-3.05A7 7 0 0 1 11 4z',
  calendar: 'M5 4h14a1 1 0 0 1 1 1v15H4V5a1 1 0 0 1 1-1zm0 5h14M8 2v4M16 2v4',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  note: 'M7 4h10l3 3v13H7zM9 10h6M9 14h6',
  weather: 'M7 18a4 4 0 1 1 .7-7.94A5 5 0 1 1 18 12h-1',
  currency: 'M12 2v20M16 6.5A4 4 0 0 0 12 5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 1 0 7 4 4 0 0 1-4-3.5',
  stats: 'M5 19V9M12 19V5M19 19v-8',
  notification: 'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2h16z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  'arrow-right': 'M5 12h14M13 5l7 7-7 7',
  'arrow-left': 'M19 12H5M11 19l-7-7 7-7',
  palette: 'M12 3a9 9 0 1 0 9 9 3 3 0 0 0-3-3h-1.5a2.5 2.5 0 0 1 0-5H17A9 9 0 0 0 12 3z',
  settings: 'M10.5 3h3l.6 2.2 2.3.9 2-1.1 2.1 2.1-1.1 2 1 2.3 2.2.7v3l-2.2.6-1 2.2 1 2-2.1 2.1-2-1.1-2.3 1- .7 2.2h-3l-.6-2.2-2.3-1-2 1.1-2.1-2.1 1.1-2-1-2.3-2.2-.6v-3l2.2-.7 1-2.3-1-2 2.1-2.1 2 1.1 2.3-.9z',
  heart: 'M12 21s-6-4.35-10-9a5 5 0 0 1 7.07-7.07L12 5l2.93-2.93A5 5 0 0 1 22 12c-4 4.65-10 9-10 9z',
  trash: 'M3 6h18M9 6V4a2 2 0 1 1 4 0v2m5 0v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h16z',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
}

export function UiIcon({ name }: UiIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-7">
      <path d={iconPaths[name]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}