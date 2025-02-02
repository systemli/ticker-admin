import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import TickerUsersForm from './TickerUsersForm'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('TickerUsersForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', token)
  })

  beforeEach(() => {
    fetchMock.resetMocks()
    handleSubmit.mockClear()
  })

  const handleSubmit = vi.fn()

  const setup = (defaultValue: Array<User>, ticker: Ticker, onSubmit: () => void) => {
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
              <TickerUsersForm defaultValue={defaultValue} onSubmit={onSubmit} ticker={ticker} />
              <input name="Submit" type="submit" value="Submit" form="tickerUsersForm" />
            </NotificationProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should renders correctly', async () => {
    const ticker = {
      id: 1,
      title: 'Ticker 1',
    } as Ticker
    const user = {
      id: 1,
      email: 'user@systemli.org',
    } as User

    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          users: [user],
        },
        status: 'success',
      })
    )

    setup([user], ticker, handleSubmit)

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toBeInTheDocument()
    expect(screen.getAllByText('user@systemli.org')).toHaveLength(2)

    await userEvent.click(screen.getAllByText('user@systemli.org')[1])

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
      })
    )

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/users', {
      body: JSON.stringify({ users: [] }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })
})
