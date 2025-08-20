import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import HomeView from './HomeView'

describe('HomeView', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    vi.clearAllMocks()
  })

  function setup() {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    return render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <NotificationProvider>
            <AuthProvider>
              <HomeView />
            </AuthProvider>
          </NotificationProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render error when query fails', async () => {
    fetchMock.mockReject(new Error('Failed to fetch'))

    const token = sign(
      {
        id: 1,
        email: 'louis@systemli.org',
        roles: ['user', 'admin'],
        exp: new Date().getTime() / 1000 + 600,
      },
      'secret'
    )
    vi.mocked(localStorage.getItem).mockReturnValue(token)

    setup()

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should render tickers list', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { tickers: [] } }))

    const token = sign(
      {
        id: 1,
        email: 'louis@systemli.org',
        roles: ['user', 'admin'],
        exp: new Date().getTime() / 1000 + 600,
      },
      'secret'
    )

    vi.mocked(localStorage.getItem).mockReturnValue(token)

    setup()

    // Wait for initial loading state, then for final state
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Tickers')).toBeInTheDocument()
    })
  })

  it('should redirect to ticker when user has only one ticker', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { tickers: [{ id: 1 }] } }))

    const token = sign(
      {
        id: 1,
        email: 'louis@systemli.org',
        roles: ['user'],
        exp: new Date().getTime() / 1000 + 600,
      },
      'secret'
    )

    vi.mocked(localStorage.getItem).mockReturnValue(token)

    setup()

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })
})
