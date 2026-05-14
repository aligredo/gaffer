import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pitch: '#0D2818',
        accent: '#39FF14',
        gold: '#FFD700',
        navy: '#0A1628',
        chalk: '#F5F5F0',
        'card-bg': '#16213e',
        surface: '#1a1a2e',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        barlow: ['"Barlow Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
