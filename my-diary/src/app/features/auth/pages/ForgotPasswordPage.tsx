import { UiIcon } from '../../../shared/components/UiIcon'

export function ForgotPasswordPage() {
  return (
    <section className="auth-card">
      <div className="auth-card__hero">
        <span className="eyebrow">Recuperación</span>
        <h1>Recupera tu acceso</h1>
        <p>Espacio listo para integrar el flujo de reset de contraseña.</p>
      </div>

      <form className="auth-form">
        <label>
          Email
          <div className="input-icon">
            <UiIcon name="mail" />
            <input type="email" placeholder="demo@correo.com" />
          </div>
        </label>
        <button type="button" className="button button--primary button--full">
          <UiIcon name="forgot" />
          Enviar enlace
        </button>
        <div className="auth-form__footer">
          <a href="/login">Volver al login</a>
        </div>
      </form>
    </section>
  )
}
