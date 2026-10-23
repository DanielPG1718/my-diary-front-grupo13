import { axiosClient } from '../../../core/api/axiosClient'
import { endpoints } from '../../../core/api/endpoints'
import type { DiaryRequest } from '../models/diary.request'
import type { DiaryResponse } from '../models/diary.response'

const buildQuery = (params: Record<string, string | number | boolean | undefined>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const diaryService = {
  async listAll() {
    return axiosClient.get<DiaryResponse[]>(`${endpoints.diary}`)
  },

  async getById(id: number) {
    return axiosClient.get<DiaryResponse>(`${endpoints.diary}/${id}`)
  },

  async getByUserId(userId: number) {
    return axiosClient.get<DiaryResponse[]>(`${endpoints.diary}/user/${userId}`)
  },

  async getFavorites(userId: number) {
    return axiosClient.get<DiaryResponse[]>(`${endpoints.diary}/user/${userId}/favorites`)
  },

  async getByMood(userId: number, mood: string) {
    return axiosClient.get<DiaryResponse[]>(`${endpoints.diary}/user/${userId}/mood/${encodeURIComponent(mood)}`)
  },

  async getByDateRange(userId: number, startDate: string, endDate: string) {
    return axiosClient.get<DiaryResponse[]>(
      `${endpoints.diary}/user/${userId}/date-range${buildQuery({ startDate, endDate })}`,
    )
  },

  async search(userId: number, keyword: string) {
    return axiosClient.get<DiaryResponse[]>(
      `${endpoints.diary}/user/${userId}/search${buildQuery({ keyword })}`,
    )
  },

  async create(payload: DiaryRequest) {
    return axiosClient.post<DiaryResponse>(`${endpoints.diary}`, payload)
  },

  async update(id: number, payload: DiaryRequest) {
    return axiosClient.request<DiaryResponse>(`${endpoints.diary}/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },

  async remove(id: number) {
    return axiosClient.request<void>(`${endpoints.diary}/${id}`, {
      method: 'DELETE',
    })
  },
}
