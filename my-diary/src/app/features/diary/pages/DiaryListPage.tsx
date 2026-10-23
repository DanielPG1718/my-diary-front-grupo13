import { useEffect, useMemo, useState } from 'react'
import { UiIcon } from '../../../shared/components/UiIcon'
import { handleError } from '../../../core/interceptors/error.interceptor'
import { diaryService } from '../services/diary.service'
import type { DiaryResponse } from '../models/diary.response'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

const parseTags = (tags?: string | null) =>
  (tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

export function DiaryListPage() {
  const [entries, setEntries] = useState<DiaryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await diaryService.listAll()
        setEntries(response)
      } catch (listError) {
        setError(handleError(listError))
      } finally {
        setLoading(false)
      }
    }

    void loadEntries()
  }, [])

  const latestEntryDate = useMemo(() => {
    if (!entries.length) return 'Sin registros recientes'
    const latest = [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0]
    return formatDate(latest.createdAt)
  }, [entries])

  return (
    <section className="page page--diary-list">
      <div className="page__hero">
        <div className="diary-list-hero__content">
          <span className="eyebrow">Historial de notas</span>
          <h1>Tu archivo personal</h1>
          <p>Consulta, edita o crea nuevas notas desde la base de datos real.</p>
          <div className="tag-row">
            <span className="tag">
              <UiIcon name="calendar" /> Ultima actividad: {latestEntryDate}
            </span>
          </div>
        </div>
        <a className="button button--primary" href="/diary/create">
          <UiIcon name="add" />
          Nueva nota
        </a>
      </div>

      {loading ? <div className="panel panel--status">Cargando notas...</div> : null}
      {error ? <div className="panel panel--status panel--error">{error}</div> : null}

      <div className="diary-list">
        {entries.map((entry) => (
          <article key={entry.id} className="diary-card">
            <div className="diary-card__date">
              <UiIcon name="calendar" />
              <span className='font-semibold'>{formatDate(entry.createdAt)}</span>
            </div>
            <h2>{entry.title}</h2>
            <p className="diary-card__excerpt">{entry.content}</p>
            <div className="tag-row">
              {parseTags(entry.tags).map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
              {entry.mood ? <span className="tag tag-mood">{entry.mood}</span> : null}
            </div>
            <div className="button-row button-row--compact">
              <a className="button button--secondary" href={`/diary/detail?id=${entry.id}`}>
                <UiIcon name="eye" /> Ver
              </a>
              <a className="button button--ghost" href={`/diary/edit?id=${entry.id}`}>
                <UiIcon name="edit" /> Editar
              </a>
              {entry.isFavorite ? (
                <button className='button button--ghost'>
                  ❤️
                </button>) : null}
            </div>
          </article>
        ))}
      </div>

      {!loading && !error && entries.length === 0 ? (
        <div className="panel panel--empty">
          <UiIcon name="diary" />
          <h3>No tienes notas todavia</h3>
          <p>Empieza con tu primera entrada y construye tu historia dia a dia.</p>
          <a className="button button--primary" href="/diary/create">
            <UiIcon name="add" /> Crear primera nota
          </a>
        </div>
      ) : null}
    </section>
  )
}
