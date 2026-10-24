import { useEffect, useRef, useState } from "react";
import { UiIcon } from "../../../shared/components/UiIcon";
import { weatherService } from "../services/weather.service";
import type { CityResponse } from "../models/city.response";
import { handleError } from "../../../core/interceptors/error.interceptor";
import type { WeatherResponse } from "../models/weather.response";

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1)

const formatCityLabel = (city: CityResponse): string =>
  city.state
    ? `${city.name}, ${city.state}, ${city.country}`
    : `${city.name}, ${city.country}`;

const normalizeStr = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function WeatherWidget() {
  const [cities, setCities] = useState<CityResponse[]>([])
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [loadingCities, setLoadingCities] = useState(true)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [error, setError] = useState('')

  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await weatherService.getCities()
        setCities(data)
      } catch (err) {
        setError(handleError(err))
      } finally {
        setLoadingCities(false)
      }
    }

    void loadCities()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities =
    inputValue.trim().length > 0
      ? cities.filter((city) =>
        normalizeStr(formatCityLabel(city)).includes(
          normalizeStr(inputValue)
        )
      )
      : cities;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedCityId(null);
    setIsOpen(true);
  }

  const handleInputFocus = () => {
    setIsOpen(true);
  }

  const handleSelectCity = (city: CityResponse) => {
    setSelectedCityId(city.id);
    setInputValue(formatCityLabel(city));
    setIsOpen(false);
  }

  const handleSearch = async () => {
    if (selectedCityId === null) return

    setLoadingWeather(true)
    setError('')
    setWeather(null)

    try {
      const data = await weatherService.getWeatherByCity(selectedCityId)
      setWeather(data)
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoadingWeather(false)
    }
  }

  const currentClima = weather?.clima?.[0]

  return (
    <section className="studio-widget weather-widget" aria-labelledby="weather-title">
      <header className="studio-widget__heading">
        <span className="studio-widget__icon studio-widget__icon--weather"><UiIcon name="weather" /></span>
        <h2 id="weather-title">El clima</h2>
      </header>
      <div className="weather-search">
        <label className="studio-field-label" htmlFor="weather-city">¿Dónde estás hoy?</label>
        <div ref={comboboxRef} className="weather-search__combobox">
          <input id="weather-city" type="text" className="studio-input"
            placeholder={loadingCities ? 'Cargando ciudades...' : 'Buscar ciudad, estado o país'}
            disabled={loadingCities} value={inputValue} onChange={handleInputChange}
            onFocus={handleInputFocus} autoComplete="off" />
          {isOpen && !loadingCities && (
            <ul className="weather-city-options">
              {filteredCities.length > 0 ? filteredCities.map((city) => (
                <li key={city.id} onMouseDown={() => handleSelectCity(city)}>{formatCityLabel(city)}</li>
              )) : <li className="weather-city-options__empty">No se encontraron ciudades</li>}
            </ul>
          )}
        </div>
        <button className="workspace-button weather-search__button" aria-label={loadingWeather ? 'Buscando clima' : 'Buscar clima'} title="Buscar clima"
          disabled={selectedCityId === null || loadingWeather} onClick={() => void handleSearch()}>
          <UiIcon name="arrow-right" />
        </button>
      </div>
      {error && <div className="studio-error" role="alert">{error}</div>}
      {loadingWeather && <div className="studio-widget__empty" role="status">Consultando el clima...</div>}
      {weather && currentClima && (
        <div className="weather-result" aria-live="polite">
          <div className="weather-result__main">
            <div className="weather-result__illustration">
              <img src={new URL(`../icons/${currentClima.icono}.png`, import.meta.url).href} alt={currentClima.estado} />
            </div>
            <div className="weather-result__reading">
              <strong>{weather.temperatura}<span>°C</span></strong>
              <p>{capitalize(currentClima.estado)}</p>
              <small>Sensación de {weather.sensacion_termica}°C</small>
            </div>
          </div>
          <p className="weather-result__location">{weather.ubicacion}</p>
          <div className="weather-result__details">
            <div><span className="weather-detail-icon"><UiIcon name="humidity" /></span><span><strong>{weather.humedad}%</strong><small>Humedad</small></span></div>
            <div><span className="weather-detail-icon"><UiIcon name="wind" /></span><span><strong>{weather.velocidad_viento} km/h</strong><small>Viento</small></span></div>
          </div>
        </div>
      )}
      {!weather && !loadingWeather && !error && (
        <div className="studio-widget__empty weather-empty">
          <span className="weather-empty__sun" aria-hidden="true">☀</span>
          <strong>Un vistazo al día</strong>
          <p>Selecciona una ciudad y pulsa la flecha.</p>
        </div>
      )}
    </section>
  );
}
