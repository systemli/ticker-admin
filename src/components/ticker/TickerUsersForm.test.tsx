import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import { fireEvent, render, screen } from '@testing-library/react'
import TickerUsersForm from './TickerUsersForm'
import { vi } from 'vitest'

describe('TickerUsersForm', () => {
  beforeEach(() => {
    fetch.resetMocks()
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
        <TickerUsersForm defaultValue={defaultValue} onSubmit={onSubmit} ticker={ticker} />
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
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {
          users: [user],
        },
        status: 'success',
      })
    )

    const handleSubmit = vi.fn()
    setup([user], ticker, handleSubmit)

    fireEvent.mouseDown(screen.getByRole('button'))
    const listbox = await screen.findByRole('listbox')
    expect(listbox).toBeInTheDocument()
    const option = await screen.findByRole('option')
    expect(option).toBeInTheDocument()
    fireEvent.click(option)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
