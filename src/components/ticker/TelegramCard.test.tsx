import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { queryClient, setup, userToken } from '../../tests/utils'
import TelegramCard from './TelegramCard'

describe('TelegramCard', () => {
  beforeAll(() => {
    localStorage.setItem('token', userToken)
  })

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const ticker = ({ active, connected, channelName = '' }: { active: boolean; connected: boolean; channelName?: string }) => {
    return {
      id: 1,
      telegram: {
        active: active,
        connected: connected,
        channelName: channelName,
        botUsername: 'bot',
      },
    } as Ticker
  }

  const component = ({ ticker }: { ticker: Ticker }) => {
    return <TelegramCard ticker={ticker} />
  }

  it('should render the component', () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('Telegram')).toBeInTheDocument()
    expect(screen.getByText('You are not connected with Telegram.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
  })

  it('should render the component when connected and active', async () => {
    setup(queryClient, component({ ticker: ticker({ active: true, connected: true, channelName: 'channel' }) }))

    expect(screen.getByText('Telegram')).toBeInTheDocument()
    expect(screen.getByText('You are connected with Telegram.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'channel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Disable' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/telegram', {
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

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/telegram', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      method: 'delete',
    })

    await userEvent.click(screen.getByRole('button', { name: 'Configure' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should fail when response fails', async () => {
    setup(queryClient, component({ ticker: ticker({ active: true, connected: true, channelName: 'channel' }) }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    setup(queryClient, component({ ticker: ticker({ active: true, connected: true, channelName: 'channel' }) }))

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
