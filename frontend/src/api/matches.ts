import { apiClient } from './client'
import type { Match } from './types'

export type { Match } from './types'

export const getMatches = (tribeId: string) =>
  apiClient.get<Match[]>(`/tribes/${tribeId}/matches`).then((r) => r.data)

export const getMatch = (tribeId: string, mid: string) =>
  apiClient.get<Match>(`/tribes/${tribeId}/matches/${mid}`).then((r) => r.data)

export const createMatch = (tribeId: string, data: { date: string; notes?: string }) =>
  apiClient.post<Match>(`/tribes/${tribeId}/matches`, data).then((r) => r.data)

export const generateTeams = (tribeId: string, mid: string, playerIds: string[]) =>
  apiClient
    .post<Match>(`/tribes/${tribeId}/matches/${mid}/generate`, { playerIds })
    .then((r) => r.data)

export const confirmMatch = (tribeId: string, mid: string, playerIds: string[]) =>
  apiClient
    .post<Match>(`/tribes/${tribeId}/matches/${mid}/confirm`, { playerIds })
    .then((r) => r.data)
