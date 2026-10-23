import { storageService } from '../../features/auth/services/storage.service'

export function withJwt(headers: Record<string, string> = {}) {
  const token = storageService.getToken()

  if (!token) {
    return headers
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  }
}
