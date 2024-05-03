import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import { render, screen } from '@testing-library/react'
import TickerUsersForm from './TickerUsersForm'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../contexts/AuthContext'

describe('TickerUsersForm', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  function setup(defaultValue: Array<User>, ticker: Ticker, onSubmit: () => void) {
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
            <TickerUsersForm defaultValue={defaultValue} onSubmit={onSubmit} ticker={ticker} />
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

    const handleSubmit = vi.fn()
    setup([user], ticker, handleSubmit)

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toBeInTheDocument()
    expect(screen.getAllByText('user@systemli.org')).toHaveLength(2)

    await userEvent.click(screen.getAllByText('user@systemli.org')[1])
  })
})
