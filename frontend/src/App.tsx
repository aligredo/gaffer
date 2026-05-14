import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './components/Layout/AppLayout'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { TribePage } from './pages/TribePage'
import { MatchGeneratorPage } from './pages/MatchGeneratorPage'
import { MatchDetailPage } from './pages/MatchDetailPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tribes/:id" element={<TribePage />} />
            <Route path="tribes/:id/matches/new" element={<MatchGeneratorPage />} />
            <Route path="tribes/:id/matches/:mid" element={<MatchDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
