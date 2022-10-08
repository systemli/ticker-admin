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
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import '../leaflet.config.js'

const App: FC = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
