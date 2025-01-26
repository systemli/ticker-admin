import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
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
      active: true,
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
              <TickerForm ticker={ticker} id="1" callback={callback} />
              <input name="Submit" type="submit" value="Submit" form="configureWebsites" />
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
})
