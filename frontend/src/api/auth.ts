import { apiClient } from './client'
import type { AuthResponse } from './types'

export const signup = (data: { name: string; username: string; password: string }) =>
  apiClient.post<AuthResponse>('/auth/signup', data).then((r) => r.data)

export const login = (data: { username: string; password: string }) =>
  apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data)
