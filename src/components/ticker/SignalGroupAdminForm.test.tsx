import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker } from '../../api/Ticker'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import SignalGroupAdminForm from './SignalGroupAdminForm'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('SignalGroupForm', () => {
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

  const callback = vi.fn()
  const setSubmitting = vi.fn()

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
              <div>
                <SignalGroupAdminForm callback={callback} ticker={ticker} setSubmitting={setSubmitting} />
                <input name="Submit" type="submit" value="Submit" form="configureSignalGroupAdmin" />
              </div>
            </NotificationProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', async () => {
    setup(ticker({ active: false, connected: false }))

    expect(screen.getByText('Only do this if extra members with write access are needed.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Phone number' })).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox', { name: 'Phone number' }), '+49123456789')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/signal_group/admin', {
      body: '{"number":"+49123456789"}',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should render the error message', async () => {
    setup(ticker({ active: false, connected: false }))

    expect(screen.getByText('Only do this if extra members with write access are needed.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Phone number' })).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox', { name: 'Phone number' }), '+49123456789')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }), { status: 400 })

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(screen.getByText('Failed to add number to Signal group')).toBeInTheDocument()
  })
})
