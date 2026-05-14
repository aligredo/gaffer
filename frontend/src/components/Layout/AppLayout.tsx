import { Outlet, Navigate } from 'react-router-dom'
import { Header } from './Header'
import { useAuthStore } from '../../store/auth'

export function AppLayout() {
  const { token } = useAuthStore()

  if (!token) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="min-h-screen bg-navy">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
