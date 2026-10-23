import { useEffect, useState } from 'react'
import { UiIcon } from '../../../shared/components/UiIcon'
import { handleError } from '../../../core/interceptors/error.interceptor'
import { diaryService } from '../services/diary.service'
import type { DiaryResponse } from '../models/diary.response'

const getDiaryIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  return id ? Number(id) : null
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

const parseTags = (tags?: string | null) =>
  (tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

const getReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function DiaryDetailPage() {
  const diaryId = getDiaryIdFromUrl()
  const [entry, setEntry] = useState<DiaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const locationValue = entry?.location ?? "";
  let nombrePais = locationValue;
  let urlIcono = "";

  if (locationValue.includes("|")) {
    const partesLocation = locationValue.split("|");
    nombrePais = partesLocation[0] ?? "";
    urlIcono = partesLocation[1] ?? "";
  }

  useEffect(() => {
    const loadDiary = async () => {
      if (!diaryId) {
        setError('No se encontró el id de la nota.')
        setLoading(false)
        return
      }

      try {
        const response = await diaryService.getById(diaryId)
        setEntry(response)
      } catch (loadError) {
        setError(handleError(loadError))
      } finally {
        setLoading(false)
      }
    }

    void loadDiary()
  }, [diaryId])

  const tags = parseTags(entry?.tags)
  const wordCount = entry?.content ? entry.content.trim().split(/\s+/).filter(Boolean).length : 0
  const readingTime = entry?.content ? getReadingTime(entry.content) : 0

  return (
    <section className="page space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-linear-to-br from-indigo-50 via-white to-sky-50 px-6 py-7 shadow-[0_24px_60px_rgba(30,41,59,0.08)] sm:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#d25b8a]">
              <UiIcon name="diary" />
              Detalle de nota
            </span>
            <h1 className="text-3xl py-2 font-black tracking-tight text-slate-900 sm:text-4xl">{entry?.title ?? 'Sin título'}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                <UiIcon name="calendar" />
                {entry ? formatDate(entry.createdAt) : 'Fecha no disponible'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                <UiIcon name="note" />
                {entry ? `${wordCount} palabras` : '0 palabras'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                <UiIcon name="history" />
                {entry ? `${readingTime} min lectura` : '0 min lectura'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={entry ? `/diary/edit?id=${entry.id}` : '/diary/edit'}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-[#d25b8a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#c04a70]"
            >
              <UiIcon name="edit" />
              Editar
            </a>
            <a
              href="/diary"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400"
            >
              <UiIcon name="arrow-left" />
              Volver
            </a>
          </div>
        </div>

        {entry ? (
          <div className="relative mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <UiIcon name="heart" />
              {entry.isFavorite ? 'Favorita' : 'No favorita'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              <UiIcon name="lock" />
              {entry.isPrivate ? 'Privada' : 'Publica'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
              <UiIcon name="notification" />
              {entry.mood ?? 'Sin estado de animo'}
            </span>
          </div>
        ) : null}
      </header>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600">Cargando detalle...</div>
      ) : null}
      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">{error}</div>
      ) : null}

      {entry ? (
        <article className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_18px_45px_rgba(30,41,59,0.08)] sm:p-7">
            <h2 className="text-xl font-bold text-slate-900">Contenido</h2>
            <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">{entry.content || 'Sin contenido'}</p>
          </section>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(30,41,59,0.06)]">
              <h3 className="text-base font-bold text-slate-900">Metadatos</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-slate-800">Creada</span>
                  <span className="text-right">{formatDate(entry.createdAt)}</span>
                </p>
                <p className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-slate-800">Actualizada</span>
                  <span className="text-right">{formatDate(entry.updatedAt)}</span>
                </p>
                <p className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-slate-800">Lugar</span>
                  {urlIcono ? (
                    <img
                      src={urlIcono}
                      alt={`Bandera de ${nombrePais}`}
                      className="h-6 w-9 rounded-sm object-cover"
                    />
                  ) : null}
                  <span className="text-right">{nombrePais ?? 'No especificado'}</span>
                </p>

              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(30,41,59,0.06)]">
              <h3 className="text-base font-bold text-slate-900">Etiquetas</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.length ? (
                  tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Sin etiquetas</p>
                )}
              </div>
            </section>
          </aside>
        </article>
      ) : null}
    </section>
  )
}
