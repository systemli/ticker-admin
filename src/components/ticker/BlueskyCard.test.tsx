import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import sign from 'jwt-encode'
import BlueskyCard from './BlueskyCard'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../contexts/AuthContext'
import { Ticker } from '../../api/Ticker'
import userEvent from '@testing-library/user-event'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('BlueSkyCard', () => {
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
            <BlueskyCard ticker={ticker} />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', () => {
    setup(ticker({ active: false, connected: false }))

    expect(screen.getByText('Bluesky')).toBeInTheDocument()
    expect(screen.getByText('You are not connected with Bluesky.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
  })

  it('should render the component when connected and active', async () => {
    setup(ticker({ active: true, connected: true, handle: 'handle.bsky.social' }))

    expect(screen.getByText('Bluesky')).toBeInTheDocument()
    expect(screen.getByText('You are connected with Bluesky.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'handle.bsky.social' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Disable' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/bluesky', {
      body: JSON.stringify({ active: false }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'put',
    })

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/bluesky', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'delete',
    })

    await userEvent.click(screen.getByRole('button', { name: 'Configure' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
