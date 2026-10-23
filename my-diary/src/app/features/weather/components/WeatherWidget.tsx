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
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <span className="card-list__icon">
          <UiIcon name="history" />
        </span>
        <span className="text-lg font-semibold text-gray-500 uppercase tracking-wide">
          Clima
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div ref={comboboxRef} className="relative">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            placeholder={
              loadingCities ? "Cargando ciudades" : "Buscar ciudad, estado o país"
            }
            disabled={loadingCities}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            autoComplete="off"
          />

          {isOpen && !loadingCities && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <li
                    key={city.id}
                    onMouseDown={() => handleSelectCity(city)}
                    className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                  >
                    {formatCityLabel(city)}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-gray-400 select-none">
                  No se encontraron ciudades
                </li>
              )}
            </ul>
          )}
        </div>

        <button
          className="w-full px-4 py-2 bg-[#4566d9] text-white font-medium rounded-md hover:bg-[#3656c7] transition-colors disabled:opacity-50"
          disabled={selectedCityId === null || loadingWeather}
          onClick={() => void handleSearch()}
        >
          {loadingWeather ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 rounded-md text-sm text-red-600">{error}</div>
      )}

      {weather && currentClima && (
        <div className="mt-2 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-20 h-20 rounded-full bg-sky-400 flex items-center justify-center shadow-sm">
                <img
                  src={new URL(`../icons/${currentClima.icono}.png`, import.meta.url).href}
                  alt={currentClima.estado}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {capitalize(currentClima.estado)}
              </p>
            </div>

            <div>
              <div>
                <span className="text-4xl font-bold text-gray-800">
                  {weather.temperatura}°C
                </span>
                <span className="text-base text-gray-400 ml-1.5">
                  ({weather.sensacion_termica}°C)
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600 mt-1">
                {weather.ubicacion}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Humedad
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {weather.humedad}%
              </span>
            </div>

            <div className="w-px h-8 bg-gray-200" />

            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Viento
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {weather.velocidad_viento} km/h
              </span>
            </div>
          </div>
        </div>
      )}

      {!weather && !loadingWeather && !error && (
        <div className="p-3 bg-gray-50 rounded-md text-center">
          <p className="text-sm text-gray-400">
            Selecciona una ciudad y pulsa Buscar
          </p>
        </div>
      )}
    </div>
  );
}