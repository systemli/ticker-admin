import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import sign from 'jwt-encode'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'
import { AuthProvider } from '../contexts/AuthContext'
import { FeatureProvider } from '../contexts/FeatureContext'
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

/**
 * Helper function to set localStorage token for tests
 * Use this instead of directly mocking localStorage.getItem
 */
export const setMockToken = (token: string | null) => {
  vi.mocked(localStorage.getItem).mockReturnValue(token)
}

/**
 * Renders component with standard provider stack (QueryClient, Router, Auth, Notification)
 * Use this for most component tests that need the standard context providers
 */
export const renderWithProviders = (children: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

/**
 * Creates a wrapper component with AuthProvider and MemoryRouter
 * Use this for renderHook tests that need authentication context
 */
export const createAuthWrapper = () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
  return Wrapper
}

/**
 * Creates a wrapper component with full provider stack including FeatureProvider
 * Use this for render tests that need all contexts
 */
export const createFullWrapper = (queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <NotificationProvider>
          <AuthProvider>
            <FeatureProvider>{children}</FeatureProvider>
          </AuthProvider>
        </NotificationProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
  return Wrapper
}

/**
 * Creates a wrapper with Auth and Feature providers (without Query Client)
 * Use this for renderHook tests that need auth and feature contexts
 */
export const createAuthFeatureWrapper = () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <AuthProvider>
        <FeatureProvider>{children}</FeatureProvider>
      </AuthProvider>
    </MemoryRouter>
  )
  return Wrapper
}
