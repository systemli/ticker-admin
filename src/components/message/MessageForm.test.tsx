import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import * as api from '../../api/Message'
import { Ticker } from '../../api/Ticker'
import { AuthProvider } from '../../contexts/AuthContext'
import MessageForm from './MessageForm'

describe('MessageForm', () => {
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
            <MessageForm ticker={ticker} />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should render the component', async () => {
    vi.spyOn(api, 'postMessageApi').mockResolvedValue({ status: 'success' })
    setup({
      id: 1,
      title: 'ticker',
      bluesky: { active: false },
      mastodon: { active: false },
      telegram: { active: false },
      location: { lat: 0, lon: 0 },
    } as Ticker)

    expect(screen.getByText('0/4096')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByText('The message is required.')).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox'), 'Hello, World!')
    expect(screen.getByText('13/4096')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(api.postMessageApi).toHaveBeenCalledTimes(1)
    expect(api.postMessageApi).toHaveBeenCalledWith('', '1', 'Hello, World!', { features: [], type: 'FeatureCollection' }, [])
  })
})
