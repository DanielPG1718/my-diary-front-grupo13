import { axiosClient } from '../../../core/api/axiosClient'
import { endpoints } from '../../../core/api/endpoints'
import type { CountryResponse } from '../models/country.response'

export const countryService = {
  async search(name: string): Promise<CountryResponse[]> {
    const response = await axiosClient.get<CountryResponse[]>(
      `${endpoints.countries}/search?name=${name}`
    )

    return response
  }
}