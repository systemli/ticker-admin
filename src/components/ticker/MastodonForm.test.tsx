import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker } from '../../api/Ticker'
import { AuthProvider } from '../../contexts/AuthContext'
import MastodonForm from './MastodonForm'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('MastodonForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', token)
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

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  function setup(ticker: Ticker) {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    return render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <AuthProvider>
            <div>
              <MastodonForm callback={callback} ticker={ticker} />
              <input name="Submit" type="submit" value="Submit" form="configureMastodon" />
            </div>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', async () => {
    setup(ticker({ active: false, connected: false }))

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
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })
})
