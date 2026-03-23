import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import TickersDropdown from './TickersDropdown'

describe('TickersDropdown', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  const onChange = vi.fn()

  const component = ({ tickers }: { tickers: Array<Ticker> }) => {
    return <TickersDropdown defaultValue={tickers} name="tickers" onChange={onChange} />
  }

  it('should renders correctly', async () => {
    const ticker = {
      id: 1,
      title: 'Ticker 1',
    } as Ticker

    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          tickers: [ticker],
        },
        status: 'success',
      })
    )
    renderWithProviders(component({ tickers: [] }))

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toBeInTheDocument()
    expect(screen.getByText('Ticker 1')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Ticker 1'))

    expect(onChange).toHaveBeenCalledWith([ticker])
  })

  it('should handle error response on fetch', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    renderWithProviders(component({ tickers: [] }))

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should handle request failure on fetch', async () => {
    fetchMock.mockReject()

    renderWithProviders(component({ tickers: [] }))

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
