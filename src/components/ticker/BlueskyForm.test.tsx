import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker } from '../../api/Ticker'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import BlueskyForm from './BlueskyForm'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('BlueskyForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', token)
  })

  const ticker = ({ active, connected, handle = '', appKey = '' }: { active: boolean; connected: boolean; handle?: string; appKey?: string }) => {
    return {
      id: 1,
      bluesky: {
        active: active,
        connected: connected,
        handle: handle,
        appKey: appKey,
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
            <NotificationProvider>
              <BlueskyForm callback={callback} ticker={ticker} />
              <input name="Submit" type="submit" value="Submit" form="configureBluesky" />
            </NotificationProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', async () => {
    setup(ticker({ active: false, connected: false }))

    expect(screen.getByText('You need to create a application password in Bluesky.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Handle' })).toBeInTheDocument()
    expect(screen.getByLabelText('Application Password *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Handle' }), 'handle.bsky.social')
    await userEvent.type(screen.getByLabelText('Application Password *'), 'password')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/bluesky', {
      body: '{"active":true,"handle":"handle.bsky.social","appKey":"password"}',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })
})
