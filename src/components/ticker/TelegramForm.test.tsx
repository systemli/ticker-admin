import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import TelegramForm from './TelegramForm'

describe('TelegramForm', () => {
  beforeEach(() => {
    setMockToken(userToken)
    callback.mockClear()
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

  const callback = vi.fn()

  const component = ({ ticker }: { ticker: Ticker }) => {
    return (
      <>
        <TelegramForm callback={callback} ticker={ticker} />
        <input name="Submit" type="submit" value="Submit" form="configureTelegram" />
      </>
    )
  }

  it('should render the component', async () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeInTheDocument()
    expect(screen.getByLabelText('Channel *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByLabelText('Channel *'), '@channel')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/telegram', {
      body: JSON.stringify({ active: true, channelName: '@channel' }),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should fail when response fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByLabelText('Channel *'), '@channel')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByLabelText('Channel *'), '@channel')

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
