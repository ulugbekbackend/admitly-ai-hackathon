import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import PrivateRoute from '@/components/layout/PrivateRoute'
import AppLayout from '@/components/layout/AppLayout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ChecklistPage from '@/pages/ChecklistPage'
import EssayPage from '@/pages/EssayPage'
import ProfilePage from '@/pages/ProfilePage'
import PricingPage from '@/pages/PricingPage'
import ProgramsPage from '@/pages/ProgramsPage'
import ProgramDetailPage from '@/pages/ProgramDetailPage'
import MyEssaysPage from '@/pages/MyEssaysPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 2 * 60 * 1000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected — wrapped in AppLayout */}
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/essay" element={<EssayPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ProgramDetailPage />} />
            <Route path="/my-essays" element={<MyEssaysPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}
