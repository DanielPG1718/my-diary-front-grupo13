import { storageService } from '../../auth/services/storage.service'
import { WeatherWidget } from '../../weather/components/WeatherWidget'
import { CurrencyWidget } from '../components/CurrencyWidget'
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

  const user = storageService.getUser()
  const today = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Lima',
  }).format(new Date())

  return (
    <section className="page page--dashboard dashboard-studio">
      <header className="dashboard-heading">
        <div>

          <h1>Hola{user?.firstName ? `, ${user.firstName}` : ''}</h1>
          <p>Un nuevo día, una nueva historia.</p>
        </div>
        <div className="dashboard-header-tools"><div className="dashboard-today"><UiIcon name="calendar" /><span>{today}</span></div><a className="dashboard-search-link" href="/diary"><UiIcon name="search" /><span>Buscar notas, ideas...</span><UiIcon name="arrow-right" /></a></div>
      </header>
      <div className="dashboard-columns">
        <div className="dashboard-content">
          <section className="dashboard-welcome">
            <div className="dashboard-welcome__copy">

              <h2>Tu día, en un solo lugar</h2>
              <p>Guarda tus ideas y encuentra inspiración cada día.</p>
              <a className="workspace-button" href="/diary/create"><UiIcon name="edit" /> Escribir una nota <UiIcon name="arrow-right" /></a>
            </div>
            <img className="dashboard-notebook-image" src="/design/notebook.png" alt="Cuaderno abierto con un lápiz y plantas" />
          </section>
          <section className="dashboard-notes">
            <div className="dashboard-section-heading">
              <h2><UiIcon name="note" /> Notas recientes</h2>
              <a href="/diary">Ver todas <UiIcon name="arrow-right" /></a>
            </div>
            {loading ? <div className="dashboard-message" role="status">Cargando tus notas...</div> : null}
            {error ? <div className="dashboard-message dashboard-message--error" role="alert">{error}</div> : null}
            {!loading && !error && entries.length === 0 ? <div className="dashboard-message"><UiIcon name="diary" /><p>Tu próxima historia empieza aquí.</p><a href="/diary/create">Escribe tu primera nota →</a></div> : null}
            <div className="dashboard-note-grid">
              {entries.map((entry) => (
                <article key={entry.id} className="dashboard-note">
                  <div className="dashboard-note__top">
                    <span className="dashboard-note__icon"><UiIcon name="note" /></span>
                    <span className="dashboard-note__tag">{entry.tags?.split(',')[0]?.trim() || 'Mi diario'}</span>
                    {entry.isFavorite ? <span className="dashboard-note__favorite" title="Nota favorita"><UiIcon name="heart" /></span> : null}
                  </div>
                  <h3>{entry.title}</h3>
                  <p className="dashboard-note__excerpt">{entry.content}</p>
                  <small className="dashboard-note__date"><UiIcon name="calendar" />{formatDate(entry.createdAt)}</small>
                </article>
              ))}
            </div>
          </section>
          <figure className="dashboard-banner">
            <img src="/image.png" alt="Los amigos de One Piece levantan sus brazos frente al mar" />
          </figure>
        </div>
        <aside className="dashboard-widgets" aria-label="Clima y cambio de moneda">
          <WeatherWidget />
          <CurrencyWidget />
        </aside>
      </div>
    </section>
  )
}
