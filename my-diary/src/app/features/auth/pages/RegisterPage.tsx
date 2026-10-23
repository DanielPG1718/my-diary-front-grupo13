import { type FormEvent, useState } from 'react'
import { handleError } from '../../../core/interceptors/error.interceptor'
import { authService } from '../services/auth.service'
import { UiIcon } from '../../../shared/components/UiIcon'

type RegisterErrors = {
  username?: string
  email?: string
  password?: string
  firstName?: string
  lastName?: string
}

export function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [errors, setErrors] = useState<RegisterErrors>({})
  const validateForm = () => {
    const newErrors: RegisterErrors = {}

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()

    if (!trimmedUsername) {
      newErrors.username = 'El username es obligatorio'
    } else if (trimmedUsername.length < 3) {
      newErrors.username = 'El username debe tener al menos 3 caracteres'
    } else if (trimmedUsername.length > 20) {
      newErrors.username = 'El username no debe exceder 20 caracteres'
    }

    if (!trimmedEmail) {
      newErrors.email = 'El correo es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Ingresa un correo válido'
    } else if (trimmedEmail.length > 100) {
      newErrors.email = 'El correo no debe exceder 100 caracteres'
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    } else if (password.length > 50) {
      newErrors.password = 'La contraseña no debe exceder 50 caracteres'
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'Debe incluir al menos una letra mayúscula'
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = 'Debe incluir al menos un número'
    } else if (!/(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~])/.test(password)) {
      newErrors.password = 'Debe incluir al menos un carácter especial'
    }

    if (!trimmedFirstName) {
      newErrors.firstName = 'El nombre es obligatorio'
    } else if (trimmedFirstName.length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres'
    } else if (trimmedFirstName.length > 50) {
      newErrors.firstName = 'El nombre no debe exceder 50 caracteres'
    }

    if (!trimmedLastName) {
      newErrors.lastName = 'El apellido es obligatorio'
    } else if (trimmedLastName.length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres'
    } else if (trimmedLastName.length > 50) {
      newErrors.lastName = 'El apellido no debe exceder 50 caracteres'
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
      await authService.register({ username, email, password, firstName, lastName })
      window.location.href = '/login'
    } catch (registerError) {
      setError(handleError(registerError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1fr] lg:items-center">
      <div className="relative order-2 lg:order-1">
        <div className="absolute -inset-6 rounded-[34px] bg-[radial-gradient(circle_at_top,rgba(244,143,177,0.20),transparent_58%)] blur-2xl" />
        <form className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/92 p-6 shadow-[0_28px_70px_rgba(70,90,160,0.18)] backdrop-blur-xl sm:p-8" onSubmit={handleSubmit}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d25b8a]">Registro</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1f2140]">Crea tu cuenta</h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2 block text-sm font-medium text-[#374151]">
              Username
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                <UiIcon name="profile" />
                <input value={username} onChange={(event) => setUsername(event.target.value)} type="text" placeholder="Nombre de usuario" className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]" />
              </div>
              {errors.username ? (
                  <p className="mt-2 text-sm font-medium text-[#be3460]">{errors.username}</p>
              ) : null}
            </label>

            <label className="sm:col-span-2 block text-sm font-medium text-[#374151]">
              Email
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                <UiIcon name="mail" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="correo electrónico" className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]" />
              </div>
              {errors.email ? (
                  <p className="mt-2 text-sm font-medium text-[#be3460]">{errors.email}</p>
              ) : null}
            </label>

            <label className="sm:col-span-2 block text-sm font-medium text-[#374151]">
              Contraseña
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                <UiIcon name="lock" />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Mínimo 8 caracteres" className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]" />
              </div>
              {errors.password ? (
                  <p className="mt-2 text-sm font-medium text-[#be3460]">{errors.password}</p>
              ) : null}
            </label>

            <label className="block text-sm font-medium text-[#374151]">
              Nombre
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                <UiIcon name="profile" />
                <input value={firstName} onChange={(event) => setFirstName(event.target.value)} type="text" placeholder="Nombre" className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]" />
              </div>
              {errors.firstName ? (
                  <p className="mt-2 text-sm font-medium text-[#be3460]">{errors.firstName}</p>
              ) : null}
            </label>

            <label className="block text-sm font-medium text-[#374151]">
              Apellido
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(90,101,160,0.16)] bg-[#fffafc] px-4 py-3 focus-within:border-[#f48fb1]">
                <UiIcon name="profile" />
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} type="text" placeholder="Apellido" className="w-full bg-transparent outline-none placeholder:text-[#9aa3b2]" />
              </div>
              {errors.lastName ? (
                  <p className="mt-2 text-sm font-medium text-[#be3460]">{errors.lastName}</p>
              ) : null}
            </label>
          </div>

          {error ? <p className="mt-4 rounded-2xl bg-[#fff2f6] px-4 py-3 text-sm font-medium text-[#be3460]">{error}</p> : null}

          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d25b8a] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#d25b8a33] transition hover:-translate-y-0.5 hover:bg-[#c24f7f] disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>
            <UiIcon name="register" />
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>

          <div className="mt-5 text-center text-sm">
            <a className="font-medium text-[#4566d9] transition hover:text-[#3656c7]" href="/login">
              Ya tengo cuenta, iniciar sesión
            </a>
          </div>
        </form>
      </div>

      <div className="order-1 space-y-6 text-white/95 lg:order-2">

        <div className="space-y-4">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Regístrate y empieza a construir tu historial de notas
          </h1>
        </div>
      </div>
    </section>
  )

}
