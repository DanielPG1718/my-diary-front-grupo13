export type DiaryResponse = {
  id: number
  title: string
  content: string
  userId: number
  mood?: string | null
  location?: string | null
  flag?: string | null
  weather?: string | null
  tags?: string | null
  isFavorite: boolean
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}
