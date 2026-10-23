export type DiaryRequest = {
  title: string
  content: string
  userId: number
  mood?: string
  location?: string
  flag?: string
  weather?: string
  tags?: string
  isFavorite?: boolean
  isPrivate?: boolean
}
 