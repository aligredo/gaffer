import { apiClient } from './client'
import type { Player, CreatePlayerRequest } from './types'

export type { Player, CreatePlayerRequest } from './types'

export const getPlayers = (tribeId: string) =>
  apiClient.get<Player[]>(`/tribes/${tribeId}/players`).then((r) => r.data)

export const createPlayer = (tribeId: string, data: CreatePlayerRequest) =>
  apiClient.post<Player>(`/tribes/${tribeId}/players`, data).then((r) => r.data)

export const updatePlayer = (tribeId: string, pid: string, data: Partial<CreatePlayerRequest>) =>
  apiClient.patch<Player>(`/tribes/${tribeId}/players/${pid}`, data).then((r) => r.data)

export const deletePlayer = (tribeId: string, pid: string) =>
  apiClient.delete(`/tribes/${tribeId}/players/${pid}`)
