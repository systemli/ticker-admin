import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../components/useAuth'
import HomeView from './HomeView'
import userEvent from '@testing-library/user-event'

describe('HomeView', function () {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  function jwt(role: string): string {
    return sign(
      {
        id: 1,
        email: 'louis@systemli.org',
        roles: role === 'admin' ? ['admin', 'user'] : ['user'],
        exp: new Date().getTime() / 1000 + 600,
      },
      'secret'
    )
  }

  const emptyTickerResponse = JSON.stringify({
    data: { tickers: [] },
    status: 'success',
  })

  const singleTickerResponse = JSON.stringify({
    data: {
      tickers: [
        {
          id: 1,
          creation_date: new Date(),
          domain: 'localhost',
          title: 'title',
          description: 'description',
          active: true,
        },
      ],
    },
    status: 'success',
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
          <AuthProvider>
            <HomeView />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  test('render empty list for admins', async function () {
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockReturnValue(jwt('admin'))
    fetchMock.mockIf(/^http:\/\/localhost:8080\/.*$/, (request: Request) => {
      if (request.url.endsWith('/admin/tickers')) {
        return Promise.resolve(emptyTickerResponse)
      }

      return Promise.resolve(
        JSON.stringify({
          data: {},
          status: 'error',
          error: 'error message',
        })
      )
    })
    setup()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(
      await screen.findByText(
        'There are no tickers yet. To start with a ticker, create one.'
      )
    ).toBeInTheDocument()
  })

  test('render empty list for user', async function () {
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockReturnValue(jwt('user'))
    fetchMock.mockIf(/^http:\/\/localhost:8080\/.*$/, (request: Request) => {
      if (request.url.endsWith('/admin/tickers')) {
        return Promise.resolve(emptyTickerResponse)
      }

      return Promise.resolve(
        JSON.stringify({
          data: {},
          status: 'error',
          error: 'error message',
        })
      )
    })
    setup()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(
      await screen.findByText(
        'Currently there are no tickers for you. Contact your administrator if that should be different.'
      )
    ).toBeInTheDocument()
  })

  test('render ticker view for user with 1 ticker', async function () {
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockReturnValue(jwt('user'))
    fetchMock.mockIf(/^http:\/\/localhost:8080\/.*$/, (request: Request) => {
      if (request.url.endsWith('/admin/tickers')) {
        return Promise.resolve(singleTickerResponse)
      }

      return Promise.resolve(
        JSON.stringify({
          data: {},
          status: 'error',
          error: 'error message',
        })
      )
    })
    setup()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('renders list with entries', async function () {
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockReturnValue(jwt('admin'))
    fetchMock.mockIf(/^http:\/\/localhost:8080\/.*$/, (request: Request) => {
      if (request.url.endsWith('/admin/tickers')) {
        return Promise.resolve(singleTickerResponse)
      }

      return Promise.resolve(
        JSON.stringify({
          data: {},
          status: 'error',
          error: 'error message',
        })
      )
    })
    setup()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText('localhost')).toBeInTheDocument()
  })

  test('open create ticker form', async function () {
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockReturnValue(jwt('admin'))
    fetchMock.mockIf(/^http:\/\/localhost:8080\/.*$/, (request: Request) => {
      if (request.url.endsWith('/admin/tickers')) {
        return Promise.resolve(emptyTickerResponse)
      }

      return Promise.resolve(
        JSON.stringify({
          data: {},
          status: 'error',
          error: 'error message',
        })
      )
    })
    setup()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    const button = screen.getByRole('button', { name: 'New Ticker' })
    expect(button).toBeInTheDocument()

    await userEvent.click(button)

    const dialogTitle = screen.getByText(/create ticker/i)
    expect(dialogTitle).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toBeInTheDocument()

    await userEvent.click(closeButton)
    expect(dialogTitle).not.toBeVisible()
  })
})
