import { useEffect, useMemo, useState } from 'react'
import { UiIcon } from '../../../shared/components/UiIcon'
import { storageService } from '../../auth/services/storage.service'

const highlights = [
  { title: 'No olvides escribir hoy', text: 'Anota cómo te sientes, qué pensaste o qué viviste. Un pequeño registro diario hace la diferencia.' },
  { title: 'No olvides revisar tu estado', text: 'Actualiza tu estado del día para mantener un seguimiento claro de tu ánimo y tus avances.' },
  { title: 'No olvides tus momentos importantes', text: 'Guarda tus recuerdos, metas y aprendizajes para volver a ellos cuando necesites motivación.' },
]

export function WelcomePage() {
  const user = storageService.getUser()
  const boardStorageKey = user?.id ? `my-diary-board-goal:${user.id}` : 'my-diary-board-goal:guest'
  const [boardText, setBoardText] = useState('')

  useEffect(() => {
    const savedBoardText = window.localStorage.getItem(boardStorageKey) ?? ''
    setBoardText(savedBoardText)
  }, [boardStorageKey])

  const updateBoardText = (value: string) => {
    setBoardText(value)
    window.localStorage.setItem(boardStorageKey, value)
    window.dispatchEvent(new Event('my-diary-board-updated'))
  }

  const boardHint = useMemo(() => {
    const length = boardText.trim().length
    if (!length) return 'Escribe una idea, un recuerdo o una meta para hoy.'
    if (length < 20) return '¡Bien! Ya comenzaste tu idea.'
    return 'Se ve como una gran nota para tu diario.'
  }, [boardText])

  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/75 px-3 py-4 shadow-[0_24px_80px_rgba(70,90,160,0.14)] backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(108,142,252,0.20),transparent_0_26%),radial-gradient(circle_at_85%_10%,rgba(244,143,177,0.18),transparent_0_24%),radial-gradient(circle_at_50%_100%,rgba(179,140,255,0.18),transparent_0_30%)]" />

      <div className="relative grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-7">
          <div className="space-y-4">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-[#1f2140] sm:text-4xl lg:text-5xl">
              Tu espacio personal para notas, ideas y seguimiento diario
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#6e7083] sm:text-lg">
              Crea, organiza y revisa tus notas diarias de forma fácil y atractiva. ¡Comienza hoy!
            </p>
          </div>

          {!user ? (
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#4566d9] to-[#5b7de8] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4566d944] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4566d955]" href="/login">
                <UiIcon name="login" />
                Iniciar sesión
              </a>
              <a className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#fef1f6] to-[#fff7fa] px-6 py-3 text-sm font-semibold text-[#d25b8a] border border-[#d25b8a20] shadow-md transition hover:-translate-y-1 hover:from-[#fde9f3] hover:to-[#fff4f9] hover:shadow-lg" href="/register">
                <UiIcon name="register" />
                Crear cuenta
              </a>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item, index) => {
              const icons = ['calendar', 'stats', 'profile'] as const
              const colors = ['#4566d9', '#d25b8a', '#8b5cf6']
              const bgColors = ['#f0f4ff', '#fef1f6', '#faf5ff']

              return (
                <article key={item.title} className="group rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_30px_rgba(70,90,160,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(70,90,160,0.16)]">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition" style={{ backgroundColor: bgColors[index], color: colors[index] }}>
                    <UiIcon name={icons[index]} />
                  </div>
                  <h3 className="text-base font-semibold text-[#1f2140]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6e7083]">{item.text}</p>
                </article>
              )
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-4xl bg-[radial-gradient(circle_at_top,rgba(244,143,177,0.22),transparent_55%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-4xl border border-white/80 bg-white/90 p-5 shadow-[0_30px_60px_rgba(70,90,160,0.16)]">
            <div className="flex items-center justify-between border-b border-[rgba(90,101,160,0.12)] pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#4566d9]">Panel principal</p>
                <p className="mt-1 text-lg font-semibold text-[#1f2140]">Bienvenido</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#f4f7ff] px-3 py-2 text-sm font-medium text-[#4566d9]">
                <UiIcon name="dashboard" />
                Home
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl bg-[linear-gradient(135deg,#f8fbff,#edf3ff)] p-4 w-full text-end">
                {(() => {
                  const fechaActual = new Intl.DateTimeFormat('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date())
                  return <p className="mt-2 text-[#1f2140]">Fecha actual: <span className="font-semibold">{fechaActual}</span></p>
                })()}
              </div>
            </div>

            <div className="mt-3 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#1f2140]">Pizarra de ideas</h3>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-3xl border border-dashed border-[#cfd8ff] bg-[#fbfcff] p-4 shadow-inner">
                  <label className="block text-sm font-semibold text-[#4566d9]">Escribe una idea</label>
                  <textarea
                    value={boardText}
                    onChange={(event) => updateBoardText(event.target.value)}
                    rows={5}
                    placeholder="Hoy quiero..."
                    className="mt-3 w-full resize-none rounded-2xl border border-[#e2e8ff] bg-white p-4 text-sm text-[#1f2140] outline-none placeholder:text-[#9aa3b2] focus:border-[#6c8efc]"
                  />
                  <p className="mt-3 text-sm text-[#6e7083]">{boardHint}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Cumpleaños', 'Hacer Tarea', 'Pendiente Reuniones'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => updateBoardText(label)}
                      className="rounded-full bg-[#f4f7ff] px-4 py-2 text-sm font-medium text-[#4566d9] transition hover:bg-[#e8efff]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}