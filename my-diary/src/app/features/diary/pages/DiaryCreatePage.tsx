import { type FormEvent, useState } from 'react'
import { UiIcon } from '../../../shared/components/UiIcon'
import { handleError } from '../../../core/interceptors/error.interceptor'
import { storageService } from '../../auth/services/storage.service'
import { diaryService } from '../services/diary.service'
import { useCountries } from '../../countries/hooks/useCountries'

const moodStates: string[] = ['Feliz', 'Triste', 'Enojado', 'Ansioso', 'Relajado', 'Emocionado', 'Aburrido', 'Cansado']

export function DiaryCreatePage() {
  const userId = storageService.getUser()?.id

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [tags, setTags] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPrivate, setIsPrivate] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    countryQuery,
    countries,
    selectedCountry,
    searchCountries,
    selectCountry,
  } = useCountries()



  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userId) {
      setError('No se encontró la sesión del usuario.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await diaryService.create({
        title,
        content,
        userId,
        mood: mood || undefined,


        location: selectedCountry?.name + "|" + selectedCountry?.flag || countryQuery || undefined,
        flag: selectedCountry?.flag || undefined,
        weather: undefined,
        tags: tags || undefined,
        isFavorite,
        isPrivate,
      })

      window.location.href = '/diary'
    } catch (saveError) {
      setError(handleError(saveError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <div className="page__hero">
        <div>
          <h1>Crear nota</h1>
        </div>
      </div>

      <form className="editor-card" onSubmit={handleSubmit}>
        {error ? <div className="panel">{error}</div> : null}

        <label>Título<input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título de la nota" /></label>
        <label>Contenido<textarea rows={7} minLength={10} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Escribe tu nota..." /></label>
        <div className="form-grid">
          <label>Estado de ánimo
            <select className='border border-gray-200 rounded-sm px-2 py-3 text-gray-800' value={mood} onChange={(event) => setMood(event.target.value)}>
              <option value="">Seleccionar estado de ánimo</option>
              {moodStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <label>Etiqueta<input type="text" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="personal, trabajo..." /></label>
          <div className="relative">

  
            <input
              type="text"
              value={countryQuery}
              onChange={(e) => searchCountries(e.target.value)}
              placeholder="Buscar país..."
              className="border border-gray-50 rounded-md px-3 py-2 w-full pr-12 outline-none"
            />


            {selectedCountry?.flag && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 overflow-hidden border bg-white flex items-center justify-center">
                <img
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

          
            {countryQuery.trim().length >= 2 && countries.length > 0 && (
              <ul className="absolute w-full mt-1 bg-white border border-gray-100 rounded-md shadow-lg max-h-32 overflow-auto z-10">

                {countries.map((country, index) => (
                  <li
                    key={index}
                    onClick={() => selectCountry(country)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >

                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-6 h-6 object-cover rounded-sm border"
                    />

                    <span className="text-sm text-gray-800">
                      {country.name}
                    </span>

                  </li>
                ))}

              </ul>
            )}

          </div>

          <div className='flex items-center justify-around'>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(event) => setIsFavorite(event.target.checked)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
              />
              <span className="text-gray-700">Favorito</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(event) => setIsPrivate(event.target.checked)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
              />
              <span className="text-gray-700">Privado</span>
            </label>
          </div>

        </div>

        <div className="button-row mt-2">
          <button
            type="submit"
            className="button button--primary"
            disabled={loading}
          >
            <UiIcon name="add" />
            {loading ? 'Guardando...' : 'Guardar'}
          </button>

          <a href="/diary" className="button button--secondary">
            <UiIcon name="arrow-left" />
            Volver
          </a>
        </div>
      </form>
    </section>
  )
}