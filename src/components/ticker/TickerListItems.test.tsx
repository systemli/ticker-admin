import { render, screen } from '@testing-library/react'
import { GetTickersQueryParams } from '../../api/Ticker'
import TickerListItems from './TickerListItems'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../useAuth'
import sign from 'jwt-encode'

describe('TickerListItems', function () {
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

  function setup(params: GetTickersQueryParams) {
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
            <TickerListItems params={params} />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render zero tickers', async function () {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(jwt('admin'))
    fetchMock.mockResponseOnce(JSON.stringify({ data: { tickers: [] }, status: 'success' }))

    const params = { title: '', domain: '', active: undefined } as GetTickersQueryParams
    setup(params)

    expect(screen.getByText('Loading')).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(await screen.findByText('No tickers found.')).toBeInTheDocument()
  })

  it('should render tickers for admin', async function () {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(jwt('admin'))
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          tickers: [
            {
              id: 1,
              createdAt: new Date(),
              domain: 'localhost',
              title: 'title',
              description: 'description',
              active: true,
            },
          ],
        },
        status: 'success',
      })
    )

    const params = { title: '', domain: '', active: undefined } as GetTickersQueryParams
    setup(params)

    expect(screen.getByText('Loading')).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(await screen.findByText('title')).toBeInTheDocument()
    expect(await screen.findByText('localhost')).toBeInTheDocument()
  })

  it('should render tickers for user', async function () {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(jwt('user'))
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          tickers: [
            {
              id: 1,
              createdAt: new Date(),
              domain: 'localhost',
              title: 'title',
              description: 'description',
              active: true,
            },
          ],
        },
        status: 'success',
      })
    )

    const params = { title: '', domain: '', active: undefined } as GetTickersQueryParams
    setup(params)

    expect(screen.getByText('Loading')).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should render error message', async function () {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(jwt('admin'))
    fetchMock.mockRejectOnce(new Error('bad url'))

    const params = { title: '', domain: '', active: undefined } as GetTickersQueryParams
    setup(params)

    expect(screen.getByText('Loading')).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(await screen.findByText('Unable to fetch tickers from server.')).toBeInTheDocument()
  })
})
