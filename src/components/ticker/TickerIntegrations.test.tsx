import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Ticker } from '../../api/Ticker'
import FeatureContext from '../../contexts/FeatureContext'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import { setMockToken, userToken } from '../../tests/utils'
import TickerIntegrations from './TickerIntegrations'

const ticker: Ticker = {
  id: 1,
  createdAt: new Date(),
  title: 'Test Ticker',
  description: 'Test',
  active: true,
  information: {
    author: '',
    url: '',
    email: '',
    twitter: '',
    facebook: '',
    threads: '',
    instagram: '',
    telegram: '',
    mastodon: '',
    bluesky: '',
  },
  websites: [],
  mastodon: { active: false, connected: false, name: '', server: '', screen_name: '', description: '', imageUrl: '' },
  telegram: { active: false, connected: false, botUsername: '', channelName: '' },
  bluesky: { active: false, connected: false, handle: '', appKey: '', replyRestriction: '' },
  signalGroup: { active: false, connected: false, groupID: '', groupInviteLink: '' },
  location: { lat: 0, lon: 0 },
}

describe('TickerIntegrations', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  function setup(telegramEnabled: boolean, signalGroupEnabled: boolean = true) {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    return render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <AuthProvider>
            <NotificationProvider>
              <FeatureContext.Provider value={{ features: { telegramEnabled, signalGroupEnabled }, loading: false, error: null, refreshFeatures: vi.fn() }}>
                <TickerIntegrations ticker={ticker} />
              </FeatureContext.Provider>
            </NotificationProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should show TelegramCard when telegramEnabled is true', () => {
    setup(true)

    expect(screen.getByText('Telegram')).toBeInTheDocument()
    expect(screen.getByText('Websites')).toBeInTheDocument()
    expect(screen.getByText('Mastodon')).toBeInTheDocument()
    expect(screen.getByText('Bluesky')).toBeInTheDocument()
    expect(screen.getByText('Signal Group')).toBeInTheDocument()
  })

  it('should hide TelegramCard when telegramEnabled is false', () => {
    setup(false)

    expect(screen.queryByText('Telegram')).not.toBeInTheDocument()
    expect(screen.getByText('Websites')).toBeInTheDocument()
    expect(screen.getByText('Mastodon')).toBeInTheDocument()
    expect(screen.getByText('Bluesky')).toBeInTheDocument()
    expect(screen.getByText('Signal Group')).toBeInTheDocument()
  })

  it('should hide SignalGroupCard when signalGroupEnabled is false', () => {
    setup(false, false)

    expect(screen.queryByText('Telegram')).not.toBeInTheDocument()
    expect(screen.queryByText('Signal Group')).not.toBeInTheDocument()
    expect(screen.getByText('Websites')).toBeInTheDocument()
    expect(screen.getByText('Mastodon')).toBeInTheDocument()
    expect(screen.getByText('Bluesky')).toBeInTheDocument()
  })

  it('should show SignalGroupCard when signalGroupEnabled is true', () => {
    setup(false, true)

    expect(screen.getByText('Signal Group')).toBeInTheDocument()
    expect(screen.getByText('Websites')).toBeInTheDocument()
    expect(screen.getByText('Mastodon')).toBeInTheDocument()
    expect(screen.getByText('Bluesky')).toBeInTheDocument()
  })
})
