import { useNavigate } from 'react-router-dom'
import { GafferLogo } from '../GafferLogo'
import { Button } from '../ui/Button'
import { useAuthStore } from '../../store/auth'
import { useThemeStore } from '../../store/theme'

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <header className="sticky top-0 z-40 bg-navy/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
          <GafferLogo size={36} />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="text-chalk/50 hover:text-chalk transition text-lg"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user && (
            <>
              <span className="text-chalk/50 text-sm font-barlow hidden sm:block">
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
