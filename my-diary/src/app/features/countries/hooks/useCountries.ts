import { useState } from 'react'
import { countryService } from '../services/country.service'

export function useCountries() {
  const [countryQuery, setCountryQuery] = useState('')
  const [countries, setCountries] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null)
  const [loadingCountries, setLoadingCountries] = useState(false)

  const searchCountries = async (value: string) => {
    setCountryQuery(value)

    if (!value.trim()) {
      setCountries([])
      setSelectedCountry(null)
      return
    }

    if (value.length < 2) {
      setCountries([])
      return
    }

    setLoadingCountries(true)

    try {
      const response = await countryService.search(value)
      const data = response

      setCountries(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setCountries([])
    } finally {
      setLoadingCountries(false)
    }
  }

  const selectCountry = (country: any) => {
    setSelectedCountry(country)
    setCountryQuery(country.name)
    setCountries([])
  }

  const clearCountry = () => {
    setSelectedCountry(null)
    setCountryQuery('')
    setCountries([])
  }

  return {
    countryQuery,
    countries,
    selectedCountry,
    loadingCountries,
    searchCountries,
    selectCountry,
    clearCountry
  }
}