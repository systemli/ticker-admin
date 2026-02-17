import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import TickerResetModal from './TickerResetModal'

describe('TickerResetModal', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
    onClose.mockClear()
  })

  const onClose = vi.fn()

  const component = ({ ticker }: { ticker: Ticker }) => {
    return <TickerResetModal open={true} onClose={onClose} ticker={ticker} />
  }

  const ticker = {
    id: 1,
    title: 'Ticker 1',
  } as Ticker

  it('should render the component', async () => {
    renderWithProviders(component({ ticker }))

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/reset', {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
  })

  it('should render the component and close the modal', async () => {
    renderWithProviders(component({ ticker }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(0)
  })

  it('should fail when response fails', async () => {
    renderWithProviders(component({ ticker }))

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ ticker }))

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
