import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import sign from 'jwt-encode'
import { MemoryRouter, Route, Routes } from 'react-router'
import { vi } from 'vitest'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import TickerView from './TickerView'

describe('TickerView', function () {
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
        <MemoryRouter initialEntries={['/ticker/1']}>
          <NotificationProvider>
            <AuthProvider>
              <Routes>
                <Route element={<ProtectedRoute outlet={<TickerView />} role="user" />} path="/ticker/:tickerId" />
              </Routes>
            </AuthProvider>
          </NotificationProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      sign(
        {
          id: 1,
          email: 'louis@systemli.org',
          roles: ['user'],
          exp: new Date().getTime() / 1000 + 600,
        },
        'secret'
      )
    )
    fetchMock.resetMocks()
  })

  it('should render error when query fails', async function () {
    fetchMock.mockReject(new Error('Failed to fetch'))

    setup()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText('Ticker not found.')).toBeInTheDocument()
  })

  it('should render the ticker', async function () {
    fetchMock.doMockOnceIf(
      /v1\/admin\/tickers\/1/,
      JSON.stringify({
        data: {
          ticker: {
            id: 1,
            createdAt: new Date(),
            title: 'Ticker Title',
            description: 'Description',
            active: true,
            information: {},
            mastodon: {},
            twitter: {},
            telegram: {},
            bluesky: { replyRestriction: '' },
            signalGroup: {},
            location: {},
            websites: [],
          },
        },
        status: 'success',
      })
    )
    fetchMock.doMockOnceIf(
      /v1\/admin\/messages/,
      JSON.stringify({
        data: {
          messages: [
            {
              id: 1,
              ticker: 1,
              text: 'Message',
              createdAt: new Date(),
              geoInformation: '{"type":"FeatureCollection","features":[]}',
              attachments: [],
            },
          ],
        },
        status: 'success',
      })
    )

    setup()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Loader for the Ticker
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText('Ticker Title')).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
