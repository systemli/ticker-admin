import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders } from '../../tests/utils'
import TickersDropdown from './TickersDropdown'

describe('TickersDropdown', () => {
  beforeEach(() => {
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
})
