import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import TickersDropdown from './TickersDropdown'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Ticker } from '../../api/Ticker'

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
        <TickersDropdown defaultValue={defaultValue} name="tickers" onChange={onChange} />
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
    const handleChange = jest.fn()
    setup([], handleChange)

    fireEvent.mouseDown(screen.getByRole('button'))
    const listbox = await screen.findByRole('listbox')
    expect(listbox).toBeInTheDocument()
    const option = await screen.findByRole('option')
    expect(option).toBeInTheDocument()
    fireEvent.click(option)
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith([ticker])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
