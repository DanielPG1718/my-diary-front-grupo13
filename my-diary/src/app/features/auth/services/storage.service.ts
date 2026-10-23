import type { UserResponse } from '../models/user.response'

const TOKEN_KEY = 'my-diary-token'
const USER_KEY = 'my-diary-user'

export const storageService = {
  getToken(): string {
    return localStorage.getItem(TOKEN_KEY) ?? ''
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },
  getUser(): UserResponse | null {
    const rawUser = localStorage.getItem(USER_KEY)
    return rawUser ? (JSON.parse(rawUser) as UserResponse) : null
  },
  setUser(user: UserResponse) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  removeUser() {
    localStorage.removeItem(USER_KEY)
  },
  clear() {
    this.removeToken()
    this.removeUser()
  },
}
