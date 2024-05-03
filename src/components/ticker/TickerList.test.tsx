import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../contexts/AuthContext'
import TickerList from './TickerList'
import TickerListItems from './TickerListItems'

describe('TickerList', function () {
  beforeEach(() => {
    fetchMock.resetMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function setup() {
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
            <TickerList />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render', async function () {
    vi.mock('./TickerListItems', () => {
      return {
        __esModule: true,
        default: vi.fn(() => <div></div>),
      }
    })

    setup()

    expect(TickerListItems).toHaveBeenCalledTimes(4)
  })
})
