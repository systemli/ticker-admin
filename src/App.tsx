import React, { FC } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/useAuth'
import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import SettingsView from './views/SettingsView'
import TickerView from './views/TickerView'
import UsersView from './views/UsersView'
import ProtectedRoute from './components/ProtectedRoute'
import NotFoundView from './views/NotFoundView'
import '../leaflet.config.js'
import { FeatureProvider } from './components/useFeature'

const App: FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <FeatureProvider>
            <Routes>
              <Route
                element={<ProtectedRoute outlet={<HomeView />} role="user" />}
                path="/"
              />
              <Route
                element={<ProtectedRoute outlet={<TickerView />} role="user" />}
                path="/ticker/:tickerId"
              />
              <Route
                element={<ProtectedRoute outlet={<UsersView />} role="admin" />}
                path="/users"
              />
              <Route
                element={
                  <ProtectedRoute outlet={<SettingsView />} role="admin" />
                }
                path="/settings"
              />
              <Route element={<LoginView />} path="/login" />
              <Route element={<NotFoundView />} path="*" />
            </Routes>
          </FeatureProvider>
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
