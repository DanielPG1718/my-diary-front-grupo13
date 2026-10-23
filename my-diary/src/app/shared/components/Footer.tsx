export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Mi Diario</span>
      <div className="footer__links">
        <a href="/dashboard">Dashboard</a>
        <a href="/diary">Notas</a>
        <a href="/profile">Perfil</a>
      </div>
    </footer>
  )
}
