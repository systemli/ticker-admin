import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker, TickerWebsite } from '../../api/Ticker'
import { AuthProvider } from '../../contexts/AuthContext'
import WebsiteForm from './WebsiteForm'

const token = sign({ id: 1, email: 'user@example.org', roles: ['user'], exp: new Date().getTime() / 1000 + 600 }, 'secret')

describe('WebsiteForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', token)
  })

  const ticker = ({ websites }: { websites: Array<TickerWebsite> }) => {
    return {
      id: 1,
      websites: websites,
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
              <WebsiteForm callback={callback} ticker={ticker} />
              <input name="Submit" type="submit" value="Submit" form="configureWebsites" />
            </div>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', async () => {
    setup(ticker({ websites: [] }))

    expect(screen.getByRole('button', { name: 'Add Origin' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Add Origin' }))

    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://example.com')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/websites', {
      body: JSON.stringify({ websites: [{ origin: 'https://example.com' }] }),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })
})
