import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import SignalGroupCard from './SignalGroupCard'

describe('SignalGroupCard', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  const ticker = ({ active, connected, groupInviteLink = '' }: { active: boolean; connected: boolean; groupInviteLink?: string }) => {
    return {
      id: 1,
      title: 'Test Ticker',
      signalGroup: {
        active: active,
        connected: connected,
        groupInviteLink: groupInviteLink,
      },
    } as Ticker
  }

  const component = ({ ticker }: { ticker: Ticker }) => {
    return <SignalGroupCard ticker={ticker} />
  }

  it('should render the component when not connected', async () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('Signal Group')).toBeInTheDocument()
    expect(screen.getByText('Sends messages to a Signal group.')).toBeInTheDocument()
    expect(screen.getByText('Not configured')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/signal_group', {
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
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, groupInviteLink: 'https://signal.group/invite' }) }))

    expect(screen.getByText('Signal Group')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Your Signal group invite link:')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Test Ticker' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/signal_group', {
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
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/signal_group', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      method: 'delete',
    })
  })

  it('should render Enable button when connected but inactive', () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: true, groupInviteLink: 'https://signal.group/invite' }) }))

    expect(screen.getByText('Inactive')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enable' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Disable' })).not.toBeInTheDocument()
  })

  it('should fail when response fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true }) }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true }) }))

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
