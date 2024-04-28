import sign from 'jwt-encode'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AuthProvider } from '../contexts/AuthContext'
import TickerView from './TickerView'
import ProtectedRoute from '../components/ProtectedRoute'
import { vi } from 'vitest'

describe('TickerView', function () {
  const jwt = sign(
    {
      id: 1,
      email: 'louis@systemli.org',
      roles: ['user'],
      exp: new Date().getTime() / 1000 + 600,
    },
    'secret'
  )

  const tickerResponse = JSON.stringify({
    data: {
      ticker: {
        id: 1,
        createdAt: new Date(),
        domain: 'localhost',
        title: 'Ticker Title',
        description: 'Description',
        active: true,
        information: {},
        mastodon: {},
        twitter: {},
        telegram: {},
        bluesky: {},
        location: {},
      },
    },
  })
  const messagesResponse = JSON.stringify({
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
  })

  beforeEach(() => {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(jwt)
    fetch.resetMocks()
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
        <MemoryRouter initialEntries={['/ticker/1']}>
          <AuthProvider>
            <Routes>
              <Route element={<ProtectedRoute outlet={<TickerView />} role="user" />} path="/ticker/:tickerId" />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  test('renders a ticker with messages', async function () {
    fetch.mockIf(/^http:\/\/localhost:8080\/.*$/, (request: Request) => {
      if (request.url.endsWith('/admin/tickers/1')) {
        return Promise.resolve(tickerResponse)
      }
      if (request.url.endsWith('/admin/tickers/1/messages?limit=10')) {
        return Promise.resolve(messagesResponse)
      }

      return Promise.resolve(
        JSON.stringify({
          data: [],
          status: 'error',
          error: 'error message',
        })
      )
    })

    setup()

    // Loader for the Ticker
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText('Ticker Title')).toBeInTheDocument()

    // Loader for the Messages
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText('Message')).toBeInTheDocument()
  })
})
