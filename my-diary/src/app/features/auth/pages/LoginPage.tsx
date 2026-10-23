import { type FormEvent, useState } from 'react'
import { handleError } from '../../../core/interceptors/error.interceptor'
import { authService } from '../services/auth.service'
import { UiIcon } from '../../../shared/components/UiIcon'

type LoginErrors = {
  emailOrUsername?: string
  password?: string
}

export function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})

  const validateForm = () => {
    const newErrors: LoginErrors = {}
    const trimmedValue = emailOrUsername.trim()

    if (!trimmedValue) {
      newErrors.emailOrUsername = 'El usuario o correo es obligatorio'
    } else if (trimmedValue.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      newErrors.emailOrUsername = 'Ingresa un correo válido'
    } else if (!trimmedValue.includes('@') && trimmedValue.length < 3) {
      newErrors.emailOrUsername = 'El usuario debe tener al menos 3 caracteres'
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    } else if (password.length > 50) {
      newErrors.password = 'La contraseña no debe exceder 50 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const isValid = validateForm()
    if (!isValid) return

    setLoading(true)


    try {
      await authService.login({ emailOrUsername, password })
      window.location.href = '/'
    } catch (loginError) {
      setError(handleError(loginError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
      <div className="space-y-6 text-gray-700">
        <div className="space-y-4">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Ingresa a tu diario y retoma tus notas donde las dejaste
          </h1>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-6 rounded-[34px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_58%)] blur-2xl" />
        <form className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/92 p-6 shadow-[0_28px_70px_rgba(70,90,160,0.18)] backdrop-blur-xl sm:p-8" onSubmit={handleSubmit}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#4566d9]">Login</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1f2140]">Bienvenido de nuevo</h2>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#374151]">
              Email o usuario
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#f8fbff] px-4 py-3 focus-within:border-[#6c8efc]">
                <UiIcon name="mail" />
                <input
                  value={emailOrUsername}
                  onChange={(event) => setEmailOrUsername(event.target.value)}
                  type="text"
                  placeholder="usuario o correo electrónico"
                  className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]"
                />
              </div>
              {errors.emailOrUsername ? (
                  <p className="mt-2 text-sm font-medium text-[#be3460]">{errors.emailOrUsername}</p>
              ) : null}
            </label>

            <label className="block text-sm font-medium text-[#374151]">
              Contraseña
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#f8fbff] px-4 py-3 focus-within:border-[#6c8efc]">
                <UiIcon name="lock" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]"
                />
              </div>
              {errors.password ? (
                  <p className="mt-2 text-sm font-medium text-[#be3460]">{errors.password}</p>
              ) : null}
            </label>
          </div>

          {error ? <p className="mt-4 rounded-2xl bg-[#fff2f6] px-4 py-3 text-sm font-medium text-[#be3460]">{error}</p> : null}

          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4566d9] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4566d933] transition hover:-translate-y-0.5 hover:bg-[#3656c7] disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>
            <UiIcon name="login" />
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <a className="font-medium text-[#4566d9] transition hover:text-[#3656c7]" href="/forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
            <a className="font-medium text-[#d25b8a] transition hover:text-[#bf4e7a]" href="/register">
              Crear cuenta
            </a>
          </div>
        </form>
      </div>
    </section>
  )
}
