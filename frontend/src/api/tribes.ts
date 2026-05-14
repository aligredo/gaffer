import { apiClient } from './client'
import type { Tribe } from './types'

export type { Tribe } from './types'

export const getTribes = () => apiClient.get<Tribe[]>('/tribes').then((r) => r.data)

export const getTribe = (id: string) =>
  apiClient.get<Tribe>(`/tribes/${id}`).then((r) => r.data)

export const createTribe = (data: Partial<Tribe>) =>
  apiClient.post<Tribe>('/tribes', data).then((r) => r.data)

export const updateTribe = (id: string, data: Partial<Tribe>) =>
  apiClient.patch<Tribe>(`/tribes/${id}`, data).then((r) => r.data)

export const deleteTribe = (id: string) => apiClient.delete(`/tribes/${id}`)
