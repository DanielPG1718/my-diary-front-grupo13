import { env } from '../../../environments/env'
import { withJwt } from '../interceptors/jwt.interceptor'
import { storageService } from '../../features/auth/services/storage.service'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestConfig = {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
}

const buildHeaders = (headers: Record<string, string> = {}) => ({
  'Content-Type': 'application/json',
  ...withJwt(headers),
})

const buildUrl = (url: string) => {
  if (/^http?:\/\//i.test(url)) {
    return url
  }

  return `${env.apiUrl.replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}`
}

const handleTokenExpiration = () => {
  storageService.clear()
  window.location.href = '/login'
}

const isCorsError = (error: Error): boolean => {
  const corsIndicators = ['CORS', 'cors', 'cross-origin', 'Cross-Origin']
  return corsIndicators.some((indicator) => error.message.includes(indicator))
}

export const axiosClient = {
  async request<T>(url: string, config: RequestConfig = {}): Promise<T> {
    try {
      const response = await fetch(buildUrl(url), {
        method: config.method ?? 'GET',
        headers: buildHeaders(config.headers),
        body: config.body ? JSON.stringify(config.body) : undefined,
      })

      // Si el status es 401 (Unauthorized), el token expiró
      if (response.status === 401) {
        handleTokenExpiration()
        throw new Error('Token expirado. Por favor, inicia sesión nuevamente.')
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      if (response.status === 204) {
        return undefined as T
      }

      const contentType = response.headers.get('content-type') ?? ''
      if (contentType.includes('application/json')) {
        return (await response.json()) as T
      }

      return (await response.text()) as T
    } catch (error) {
      // Si es error de CORS o la aplicación detecta token expirado implícitamente
      if (error instanceof Error) {
        if (isCorsError(error)) {
          // Posible token expirado con error de CORS
          handleTokenExpiration()
          throw new Error('Error de autenticación. Por favor, inicia sesión nuevamente.')
        }
      }
      throw error
    }
  },

  get<T>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: 'GET', headers })
  },

  post<T>(url: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(url, { method: 'POST', body, headers })
  },
}
