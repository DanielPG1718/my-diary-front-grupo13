import { storageService } from '../../features/auth/services/storage.service'

const handleTokenExpiration = () => {
  storageService.clear()
  window.location.href = '/login'
}

export function handleError(error: unknown): string {
  if (error instanceof TypeError) {
    // CORS errors típicamente vienen como TypeError con mensajes de "cors" o "fetch"
    if (
      error.message.includes('CORS') ||
      error.message.includes('cors') ||
      error.message.includes('fetch') ||
      error.message.includes('Failed to fetch')
    ) {
      handleTokenExpiration()
      return 'Sesión expirada. Por favor, inicia sesión nuevamente.'
    }
  }

  if (error instanceof Error) {
    // Si el mensaje dice token expirado
    if (error.message.includes('Token expirado') || error.message.includes('401')) {
      handleTokenExpiration()
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    }

    return error.message
  }

  return 'Ha ocurrido un error inesperado.'
}
