import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GafferLogo } from '../components/GafferLogo'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/auth'
import { login, signup } from '../api/auth'

export function AuthPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ name: '', username: '', password: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let res
      if (tab === 'login') {
        res = await login({ username: form.username, password: form.password })
      } else {
        res = await signup({ name: form.name, username: form.username, password: form.password })
      }
      setAuth(res.accessToken, res.user)
      navigate('/')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'An error occurred'
      setError(Array.isArray(msg) ? msg.join(', ') : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <GafferLogo size={56} />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-6">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2 font-bebas text-xl tracking-widest transition-colors ${
                tab === t ? 'text-accent border-b-2 border-accent' : 'text-chalk/40'
              }`}
            >
              {t === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <Input
              label="Full Name"
              placeholder="John Smith"
              value={form.name}
              onChange={set('name')}
              required
            />
          )}
          <Input
            label="Username"
            placeholder="johnsmith"
            value={form.username}
            onChange={set('username')}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
            required
          />

          {error && (
            <p className="text-red-400 text-sm font-barlow bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? '...' : tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </Button>
        </form>
      </div>
    </div>
  )
}
