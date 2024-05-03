import { render, screen } from '@testing-library/react'
import TickersDropdown from './TickersDropdown'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Ticker } from '../../api/Ticker'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../contexts/AuthContext'
import { MemoryRouter } from 'react-router'

describe('TickersDropdown', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  function setup(defaultValue: Array<Ticker>, onChange: (tickers: Array<Ticker>) => void) {
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
            <TickersDropdown defaultValue={defaultValue} name="tickers" onChange={onChange} />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should renders correctly', async () => {
    const ticker = {
      id: 1,
      title: 'Ticker 1',
    }
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          tickers: [ticker],
        },
        status: 'success',
      })
    )
    const handleChange = vi.fn()
    setup([], handleChange)

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toBeInTheDocument()
    expect(screen.getByText('Ticker 1')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Ticker 1'))

    expect(handleChange).toHaveBeenCalledWith([ticker])
  })
})
