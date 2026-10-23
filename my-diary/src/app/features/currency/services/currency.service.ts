import { axiosClient } from '../../../core/api/axiosClient'
import { endpoints } from '../../../core/api/endpoints'

export const currencyService = {

  async list() {
    return axiosClient.get(`${endpoints.currency}`)
  },

  async convert(amount: number, from: string, to: string) {
    return axiosClient.post(`${endpoints.currency}/convert`, {
      amount,
      from,
      to
    })
  },

  async getCurrencies() {
    return axiosClient.get(`${endpoints.currency}/currencies`)
  },
  async getCurrencyMeta(code: string) {
  return axiosClient.get(`${endpoints.currency}/exchange-rate/${code}`)
}

}