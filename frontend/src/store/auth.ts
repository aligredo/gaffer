import { create } from 'zustand'
import type { AuthUser } from '../api/types'

interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
}

const storedToken = localStorage.getItem('gaffer_token')
const storedUser = (() => {
  try {
    const raw = localStorage.getItem('gaffer_user')
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
})()

export const useAuthStore = create<AuthState>()((set) => ({
  token: storedToken,
  user: storedUser,
  setAuth: (token, user) => {
    localStorage.setItem('gaffer_token', token)
    localStorage.setItem('gaffer_user', JSON.stringify(user))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('gaffer_token')
    localStorage.removeItem('gaffer_user')
    set({ token: null, user: null })
  },
}))
