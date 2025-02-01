import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker } from '../../../api/Ticker'
import { AuthProvider } from '../../../contexts/AuthContext'
import TickerForm from './TickerForm'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('TickerForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', token)
  })

  const callback = vi.fn()

  const ticker = () => {
    return {
      id: 1,
      title: 'Ticker',
      active: false,
      information: {},
      location: {},
    } as Ticker
  }

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
              <TickerForm ticker={ticker} id="tickerForm" callback={callback} />
              <input name="Submit" type="submit" value="Submit" form="tickerForm" />
            </div>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', async () => {
    setup(ticker())

    expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeInTheDocument()
  })

  it('should submit the form', async () => {
    setup(ticker())

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.clear(screen.getByRole('textbox', { name: 'Title' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'New Ticker')
    await userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'Description')
    await userEvent.type(screen.getByRole('textbox', { name: 'Author' }), 'Author')
    await userEvent.type(screen.getByRole('textbox', { name: 'Homepage' }), 'https://example.org')
    await userEvent.type(screen.getByRole('textbox', { name: 'E-Mail' }), 'author@example.org')
    await userEvent.type(screen.getByRole('textbox', { name: 'Twitter' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Facebook' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Threads' }), '@account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Instagram' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Telegram' }), 'account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Mastodon' }), 'https://mastodon.social/@account')
    await userEvent.type(screen.getByRole('textbox', { name: 'Bluesky' }), 'https://bsky.app/profile/account.bsky.social')

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1', {
      body: JSON.stringify({
        title: 'New Ticker',
        active: true,
        description: 'Description',
        information: {
          author: 'Author',
          email: 'author@example.org',
          url: 'https://example.org',
          twitter: 'account',
          facebook: 'account',
          threads: '@account',
          instagram: 'account',
          telegram: 'account',
          mastodon: 'https://mastodon.social/@account',
          bluesky: 'https://bsky.app/profile/account.bsky.social',
        },
        location: { lat: 0, lon: 0 },
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })
})
