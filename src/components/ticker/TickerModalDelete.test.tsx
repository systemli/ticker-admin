import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import TickerModalDelete from './TickerModalDelete'

describe('TickerModalDelete', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
    onClose.mockClear()
  })

  const onClose = vi.fn()

  const component = ({ ticker }: { ticker: Ticker }) => {
    return <TickerModalDelete open={true} onClose={onClose} ticker={ticker} />
  }

  const ticker = {
    id: 1,
    title: 'Ticker 1',
  } as Ticker

  it('should render the component and delete the ticker', async () => {
    renderWithProviders(component({ ticker }))

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'delete',
    })
  })

  it('should close the modal without deleting', async () => {
    renderWithProviders(component({ ticker }))

    expect(screen.getAllByRole('button', { name: 'Close' })).toHaveLength(2)

    await userEvent.click(screen.getAllByRole('button', { name: 'Close' })[1])

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(0)
  })

  it('should fail when response fails', async () => {
    renderWithProviders(component({ ticker }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ ticker }))

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
