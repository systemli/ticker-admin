import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import TickerUserModalDelete from './TickerUserModalDelete'

describe('TickerUserModalDelete', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
    onClose.mockClear()
  })

  const onClose = vi.fn()

  const component = ({ ticker, user, open }: { ticker: Ticker; user: User; open: boolean }) => {
    return <TickerUserModalDelete ticker={ticker} user={user} open={open} onClose={onClose} />
  }

  const ticker = {
    id: 1,
    title: 'Ticker 1',
  } as Ticker
  const user = {
    id: 1,
    email: 'user@example.org',
  } as User

  it('should render the component', async () => {
    renderWithProviders(component({ ticker, user, open: true }))

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/users/1', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'delete',
    })
  })

  it('should fail when response fails', async () => {
    renderWithProviders(component({ ticker, user, open: true }))

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ ticker, user, open: true }))

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should close the modal', async () => {
    renderWithProviders(component({ ticker, user, open: true }))

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
