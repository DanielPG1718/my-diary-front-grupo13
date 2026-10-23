import { axiosClient } from '../../../core/api/axiosClient'
import { endpoints } from '../../../core/api/endpoints'
import type { CityResponse } from '../models/city.response'
import type { WeatherResponse } from '../models/weather.response'

export const weatherService = {
  getCities(): Promise<CityResponse[]> {
    return axiosClient.get<CityResponse[]>(endpoints.weatherCities)
  },

  getWeatherByCity(cityId: number): Promise<WeatherResponse> {
    return axiosClient.get<WeatherResponse>(`${endpoints.weather}/${cityId}`)
  }
}
