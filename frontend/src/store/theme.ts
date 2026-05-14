import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggle: () => void
}

const apply = (t: Theme) => {
  if (t === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('gaffer_theme', t)
}

const initial: Theme =
  (localStorage.getItem('gaffer_theme') as Theme | null) ?? 'dark'

apply(initial)

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: initial,
  toggle: () =>
    set((s) => {
      const next: Theme = s.theme === 'dark' ? 'light' : 'dark'
      apply(next)
      return { theme: next }
    }),
}))
