export type UserResponse = {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
  roles?: string[]
}
