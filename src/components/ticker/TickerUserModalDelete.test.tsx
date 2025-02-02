import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import TickerUserModalDelete from './TickerUserModalDelete'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('TickerUserModalDelete', () => {
  beforeAll(() => {
    localStorage.setItem('token', token)
  })

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  function setup(ticker: Ticker, user: User, open: boolean) {
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
            <NotificationProvider>
              <TickerUserModalDelete ticker={ticker} user={user} open={open} onClose={vi.fn()} />
            </NotificationProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', async () => {
    const ticker = {
      id: 1,
      title: 'Ticker 1',
    } as Ticker
    const user = {
      id: 1,
      email: 'user@example.org',
    } as User
    setup(ticker, user, true)

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/users/1', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'delete',
    })
  })
})
