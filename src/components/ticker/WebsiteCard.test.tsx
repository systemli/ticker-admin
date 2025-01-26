import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { Ticker, TickerWebsite } from '../../api/Ticker'
import { AuthProvider } from '../../contexts/AuthContext'
import WebsiteCard from './WebsiteCard'

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
              <WebsiteCard ticker={ticker} />
              <input name="Submit" type="submit" value="Submit" form="configureWebsites" />
            </div>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component', async () => {
    setup(ticker({ websites: [] }))

    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByText('No website origins configured.')).toBeInTheDocument()
  })

  it('should delete the origins', async () => {
    setup(ticker({ websites: [{ origin: 'http://localhost', id: 1 }] }))

    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/websites', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'delete',
    })
  })

  it('should open the form', async () => {
    setup(ticker({ websites: [] }))

    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Configure' }))

    expect(screen.getByRole('button', { name: 'Add Origin' })).toBeInTheDocument()
  })
})
