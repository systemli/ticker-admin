import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { queryClient, setup, userToken } from '../../tests/utils'
import MastodonForm from './MastodonForm'

describe('MastodonForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', userToken)
  })

  beforeEach(() => {
    callback.mockClear()
    fetchMock.resetMocks()
  })

  const ticker = ({ active, connected, name = '' }: { active: boolean; connected: boolean; name?: string }) => {
    return {
      id: 1,
      mastodon: {
        active: active,
        connected: connected,
        name: name,
        server: 'https://mastodon.social',
      },
    } as Ticker
  }

  const callback = vi.fn()

  const component = ({ ticker }: { ticker: Ticker }) => {
    return (
      <>
        <MastodonForm callback={callback} ticker={ticker} />
        <input name="Submit" type="submit" value="Submit" form="configureMastodon" />
      </>
    )
  }

  it('should render the component', async () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeInTheDocument()
    expect(screen.getByLabelText('Server *')).toBeInTheDocument()
    expect(screen.getByLabelText('Client Key *')).toBeInTheDocument()
    expect(screen.getByLabelText('Client Secret *')).toBeInTheDocument()
    expect(screen.getByLabelText('Access Token *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByLabelText('Client Key *'), 'token')
    await userEvent.type(screen.getByLabelText('Client Secret *'), 'secret')
    await userEvent.type(screen.getByLabelText('Access Token *'), 'access-token')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/mastodon', {
      body: JSON.stringify({
        active: true,
        server: 'https://mastodon.social',
        token: 'token',
        secret: 'secret',
        accessToken: 'access-token',
      }),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should fail when response fails', async () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByLabelText('Client Key *'), 'token')
    await userEvent.type(screen.getByLabelText('Client Secret *'), 'secret')
    await userEvent.type(screen.getByLabelText('Access Token *'), 'access-token')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByLabelText('Client Key *'), 'token')
    await userEvent.type(screen.getByLabelText('Client Secret *'), 'secret')
    await userEvent.type(screen.getByLabelText('Access Token *'), 'access-token')

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
