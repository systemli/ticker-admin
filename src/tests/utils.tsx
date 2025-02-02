import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import sign from 'jwt-encode'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'

export const userToken = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')
export const adminToken = sign({ id: 1, email: 'admin@example.org', roles: ['admin', 'user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

export const setup = (client: QueryClient, children: ReactNode) => {
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}
