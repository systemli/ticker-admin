import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { queryClient, setup, userToken } from '../../tests/utils'
import SignalGroupCard from './SignalGroupCard'

describe('SignalGroupCard', () => {
  beforeAll(() => {
    localStorage.setItem('token', userToken)
  })

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const ticker = ({ active, connected }: { active: boolean; connected: boolean }) => {
    return {
      id: 1,
      signalGroup: {
        active: active,
        connected: connected,
      },
    } as Ticker
  }

  const component = ({ ticker }: { ticker: Ticker }) => {
    return <SignalGroupCard ticker={ticker} />
  }

  it('should render the component', async () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('Signal Group')).toBeInTheDocument()
    expect(screen.getByText("You don't have a Signal group connected.")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/signal_group', {
      body: JSON.stringify({ active: true }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      method: 'put',
    })
  })

  it('should render the component when connected and active', async () => {
    setup(queryClient, component({ ticker: ticker({ active: true, connected: true }) }))

    expect(screen.getByText('Signal Group')).toBeInTheDocument()
    expect(screen.getByText('You have a Signal group connected.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/signal_group', {
      body: JSON.stringify({ active: false }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      method: 'put',
    })

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-delete')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('dialog-delete'))

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/signal_group', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      method: 'delete',
    })
  })

  it('should fail when response fails', async () => {
    setup(queryClient, component({ ticker: ticker({ active: true, connected: true }) }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    setup(queryClient, component({ ticker: ticker({ active: true, connected: true }) }))

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
