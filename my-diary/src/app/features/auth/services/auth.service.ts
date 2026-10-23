import { axiosClient } from '../../../core/api/axiosClient'
import { endpoints } from '../../../core/api/endpoints'
import { storageService } from './storage.service'
import type { AuthRequest } from '../models/auth.request'
import type { AuthResponse } from '../models/auth.response'
import type { UserRequest } from '../models/user.request'
import type { UserResponse } from '../models/user.response'

const buildSessionUser = (response: AuthResponse, profile?: UserResponse | null): UserResponse => ({
  id: profile?.id ?? response.id,
  username: profile?.username ?? response.username,
  email: profile?.email ?? response.email,
  firstName: profile?.firstName,
  lastName: profile?.lastName,
  enabled: profile?.enabled,
  createdAt: profile?.createdAt,
  updatedAt: profile?.updatedAt,
  roles: response.roles,
})

export const authService = {
  async login(payload: AuthRequest): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>(`${endpoints.auth}/login`, payload)
    storageService.setToken(response.token)

    const profile = await axiosClient
      .get<UserResponse>(`${endpoints.users}/username/${encodeURIComponent(response.username)}`)
      .catch(() => null)

    storageService.setUser(buildSessionUser(response, profile))
    return response
  },

  async register(payload: UserRequest): Promise<UserResponse> {
    return axiosClient.post<UserResponse>(`${endpoints.auth}/register`, payload)
  },

  async registerAdmin(payload: UserRequest): Promise<UserResponse> {
    return axiosClient.post<UserResponse>(`${endpoints.auth}/register-admin`, payload)
  },

  logout() {
    storageService.clear()
  },
}
