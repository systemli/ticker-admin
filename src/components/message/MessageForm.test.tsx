import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { queryClient, setup, userToken } from '../../tests/utils'
import MessageForm from './MessageForm'

describe('MessageForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', userToken)
  })

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const component = (ticker: Ticker) => {
    return <MessageForm ticker={ticker} />
  }

  const ticker = (active: boolean) => {
    return {
      id: 1,
      title: 'ticker',
      active: active,
      bluesky: { active: false },
      mastodon: { active: false },
      telegram: { active: false },
      location: { lat: 0, lon: 0 },
    } as Ticker
  }

  it('should render the component', async () => {
    setup(queryClient, component(ticker(true)))

    expect(screen.getByText('0/4096')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByText('The message is required.')).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox'), 'Hello, World!')
    expect(screen.getByText('13/4096')).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/messages', {
      body: JSON.stringify({
        text: 'Hello, World!',
        geoInformation: {
          type: 'FeatureCollection',
          features: [],
        },
        attachments: [],
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
    })
  })

  it('should render the component when ticker is inactive', async () => {
    setup(queryClient, component(ticker(false)))

    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
  })

  it('should render the correct message length for Mastodon', async () => {
    const t = ticker(true)
    t.mastodon.active = true

    setup(queryClient, component(t))

    expect(screen.getByText('0/500')).toBeInTheDocument()
  })

  it('should render the correct message length for Bluesky', async () => {
    const t = ticker(true)
    t.bluesky.active = true

    setup(queryClient, component(t))

    expect(screen.getByText('0/300')).toBeInTheDocument()
  })
})
