import { useEffect, useState } from 'react'
import { UiIcon } from '../../../shared/components/UiIcon'
import { handleError } from '../../../core/interceptors/error.interceptor'
import type { DiaryResponse } from '../../diary/models/diary.response'
import { diaryService } from '../../diary/services/diary.service'
import { formatDate } from '../../../shared/utils/date.util'


export function DashboardPage() {
  const [entries, setEntries] = useState<DiaryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await diaryService.listAll()
        setEntries(response.slice(0, 4))
      } catch (listError) {
        setError(handleError(listError))
      } finally {
        setLoading(false)
      }
    }

    void loadEntries()
  }, [])

  return (
    <section className="page page--dashboard">
      <div>
        <div className="content-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
          <article className="panel panel--notes panel-historial-reciente">
            <h1>Bienvenido</h1>
            <div className="panel__header">
              <div>
                <span className="eyebrow">Mis notas</span>
                <h2 className='font-semibold'>Historial reciente</h2>
              </div>
              <a className="button button--ghost" href="/diary">
                <UiIcon name="history" />
                Ver todo
              </a>
            </div>
            <div className="note-list">
              {loading ? <div className="panel panel--status">Cargando notas...</div> : null}
              {error ? <div className="panel panel--status panel--error">{error}</div> : null}
              {entries.map((entry) => (
                <article key={entry.title} className="note-item" style={{ backgroundColor: '#fef3ff' }}>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.content}</p>
                    <small>{formatDate(entry.createdAt)}</small>
                  </div>
                </article>
              ))}
            </div>
            <div>
              <img className='object-cover' src='/image.png' />
            </div>
          </article>

        </div>
      </div>
    </section>
  )
}