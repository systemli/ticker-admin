import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker } from '../../api/Ticker'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import SignalGroupForm from './SignalGroupForm'

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
                <SignalGroupForm callback={callback} ticker={ticker} setSubmitting={setSubmitting} />
                <input name="Submit" type="submit" value="Submit" form="configureSignalGroup" />
              </div>
            </NotificationProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', async () => {
    setup(ticker({ active: false, connected: false }))

    expect(screen.getByText('A new Signal group will be created with these settings.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Group name' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Group description' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Group name' }), 'group name')
    await userEvent.type(screen.getByRole('textbox', { name: 'Group description' }), 'group description')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(setSubmitting).toHaveBeenNthCalledWith(1, true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/signal_group', {
      body: '{"active":true,"groupName":"group name","groupDescription":"group description"}',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
    expect(setSubmitting).toHaveBeenNthCalledWith(2, false)
  })
})
