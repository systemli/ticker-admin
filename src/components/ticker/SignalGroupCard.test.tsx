import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker } from '../../api/Ticker'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import SignalGroupCard from './SignalGroupCard'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('SignalGroupCard', () => {
  beforeAll(() => {
    localStorage.setItem('token', token)
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
              <SignalGroupCard ticker={ticker} />
            </NotificationProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', () => {
    setup(ticker({ active: false, connected: false }))

    expect(screen.getByText('Signal Group')).toBeInTheDocument()
    expect(screen.getByText("You don't have a Signal group connected.")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
  })

  it('should render the component when connected and active', async () => {
    setup(ticker({ active: true, connected: true }))

    expect(screen.getByText('Signal Group')).toBeInTheDocument()
    expect(screen.getByText('You have a Signal group connected.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Pause' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/signal_group', {
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

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-delete')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('dialog-delete'))

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/signal_group', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'delete',
    })
  })
})
