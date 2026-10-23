import { useEffect, useState } from 'react'
import { diaryService } from '../../diary/services/diary.service'
import { storageService } from '../../auth/services/storage.service'
import { UiIcon } from '../../../shared/components/UiIcon'

export function ProfilePage() {
  const user = storageService.getUser()
  const [noteCount, setNoteCount] = useState<number | null>(null)
  const [loadingNotes, setLoadingNotes] = useState(true)

  const fullName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Usuario'
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'MD'

  const roles = user?.roles ?? ['ROLE_USER']
  const lastAccess = user?.updatedAt
    ? new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(user.updatedAt))
    : 'No disponible'

  useEffect(() => {
    const loadNotes = async () => {
      if (!user?.id) {
        setNoteCount(0)
        setLoadingNotes(false)
        return
      }

      try {
        setLoadingNotes(true)
        const entries = await diaryService.getByUserId(user.id)
        setNoteCount(entries.length)
      } catch {
        setNoteCount(0)
      } finally {
        setLoadingNotes(false)
      }
    }

    void loadNotes()
  }, [user?.id])

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_rgba(70,90,160,0.14)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(244,143,177,0.18),transparent_30%),radial-gradient(circle_at_15%_10%,rgba(108,142,252,0.18),transparent_26%)]" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-[#5b7de8] to-[#8b5cf6] text-4xl font-bold text-white shadow-xl shadow-[#4566d933] ring-4 ring-white">
                {initials}
              </div>
              <button
                type="button"
                className="hover:scale-110 transition absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-[#4566d9] shadow-lg"
              >
              </button>
            </div>

            <div>
              <p className="text-sm font-medium text-[#6e7083]">Perfil del usuario</p>
              <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#1f2140]">
                {fullName}
              </h1>
              <p className="mt-2 text-sm text-[#6e7083]">{user?.email ?? ''}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-[#e7edff] px-3 py-1 text-sm font-semibold text-[#4566d9]"
                  >
                    {role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'}
                  </span>
                ))}
              </div>
            </div>
          </div>

            <a
              href="/profile/edit"
              className="self-start inline-flex items-center gap-2 rounded-2xl border border-[#4566d930] bg-white/90 px-5 py-3 text-sm font-semibold text-[#4566d9] shadow-md backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[#f4f7ff] hover:shadow-lg"
            >
              <UiIcon name="edit" />
              Editar perfil
            </a>

        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <article className="rounded-[26px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(70,90,160,0.10)] backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0f4ff] text-[#4566d9]">
              <UiIcon name="profile" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1f2140]">Datos Personales</h2>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e8ecf7] bg-[#fbfcff] p-5">
              <dt className="text-xs font-semibold text-[#8a91a6]">Username</dt>
              <dd className="mt-2 text-base font-bold text-[#1f2140]">{user?.username ?? 'usuario'}</dd>
            </div>

            <div className="rounded-2xl border border-[#e8ecf7] bg-[#fbfcff] p-5">
              <dt className="text-xs font-semibold text-[#8a91a6]">Email</dt>
              <dd title={user?.email ?? 'demo@my-diary.com'}className="mt-2 max-w-full truncate text-base font-bold text-[#1f2140]">{user?.email ?? 'demo@my-diary.com'}
              </dd>
            </div>

            <div className="rounded-2xl border border-[#e8ecf7] bg-[#fbfcff] p-5">
              <dt className="text-xs font-semibold text-[#8a91a6]">Estado</dt>
              <dd className="mt-2 flex items-center gap-2 text-base font-bold text-[#1f2140]">
                <span className="h-3 w-3 rounded-full bg-[#35d07f]" />
                {user?.enabled === false ? 'Deshabilitado' : 'Activo'}
              </dd>
            </div>

            <div className="rounded-2xl border border-[#e8ecf7] bg-[#fbfcff] p-5">
              <dt className="text-xs font-semibold text-[#8a91a6]">Rol</dt>
              <dd className="mt-2 text-base font-bold text-[#1f2140]">
                {roles.map((role) => (role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario')).join(', ')}
              </dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-4 border-t border-[#e8ecf7] pt-5 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-sm text-[#6e7083]">
              <UiIcon name="calendar" />
              <span>
                Miembro desde <br />
                <strong className="text-[#1f2140]">22 de abril de 2026</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#6e7083]">
              <UiIcon name="calendar" />
              <span>
                Zona horaria <br />
                <strong className="text-[#1f2140]">GMT -5</strong>
              </span>
            </div>
          </div>
        </article>

        <article className="rounded-[26px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(70,90,160,0.10)] backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0f4ff] text-[#4566d9]">
              <UiIcon name="stats" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1f2140]">Estadísticas</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-[#e8ecf7] bg-[#fbfcff] p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#6c8efc] to-[#8b5cf6] text-white shadow-md">
                <UiIcon name="diary" />
              </div>
              <div>
                <p className="text-sm text-[#8a91a6]">Notas creadas</p>
                <p className="text-xl font-bold text-[#1f2140]">
                  {loadingNotes ? '...' : noteCount ?? '0'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#e8ecf7] bg-[#fbfcff] p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#48cfae] text-white shadow-md">
                <UiIcon name="calendar" />
              </div>
              <div>
                <p className="text-sm text-[#8a91a6]">Último acceso</p>
                <p className="text-xl font-bold text-[#1f2140]">{lastAccess}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f4f7ff] p-5">
              <p className="text-sm font-bold text-[#4566d9]">¡Sigue creando!</p>
              <p className="mt-1 text-sm text-[#6e7083]">
                Lleva un registro de tus ideas y pensamientos.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  ) }
