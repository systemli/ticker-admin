import { render, screen } from '@testing-library/react'
import { Ticker, TickerBluesky, TickerMatrix, TickerMastodon, TickerSignalGroup, TickerTelegram, TickerWebsite } from '../../api/Ticker'
import TickerCard from './TickerCard'

describe('TickerCard', () => {
  const ticker = ({
    active = false,
    title = 'Ticker',
    websites = [] as TickerWebsite[],
    mastodon = { connected: false } as TickerMastodon,
    telegram = { connected: false } as TickerTelegram,
    bluesky = { connected: false } as TickerBluesky,
    signalGroup = { connected: false } as TickerSignalGroup,
    matrix = { connected: false } as TickerMatrix,
  }) => {
    return {
      id: 1,
      active: active,
      title: title,
      websites: websites,
      mastodon: mastodon,
      telegram: telegram,
      bluesky: bluesky,
      signalGroup: signalGroup,
      matrix: matrix,
    } as unknown as Ticker
  }

  it('renders inactive ticker', () => {
    render(<TickerCard ticker={ticker({ active: false })} />)

    expect(screen.getByText('Info')).toBeInTheDocument()
    expect(screen.getByText('Status: Inactive')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('No integrations')).toBeInTheDocument()
  })

  it('renders active ticker', () => {
    render(<TickerCard ticker={ticker({ active: true })} />)

    expect(screen.getByText('Info')).toBeInTheDocument()
    expect(screen.getByText('Status: Active')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('renders website integration', () => {
    render(<TickerCard ticker={ticker({ websites: [{ id: 1, origin: 'https://example.com' }] })} />)

    expect(screen.getByText('Integrations')).toBeInTheDocument()
    expect(screen.getByText('Websites')).toBeInTheDocument()
  })

  it('renders mastodon integration', () => {
    render(
      <TickerCard
        ticker={ticker({
          mastodon: {
            connected: true,
            active: true,
            server: 'https://systemli.social',
            name: 'systemli',
            screen_name: '',
            description: '',
            imageUrl: '',
          },
        })}
      />
    )

    expect(screen.getByText('Integrations')).toBeInTheDocument()
    expect(screen.getByText('Mastodon')).toBeInTheDocument()
  })

  it('renders telegram integration', () => {
    render(
      <TickerCard
        ticker={ticker({
          telegram: {
            connected: true,
            active: true,
            channelName: '@systemli',
            botUsername: '',
          },
        })}
      />
    )

    expect(screen.getByText('Integrations')).toBeInTheDocument()
    expect(screen.getByText('Telegram')).toBeInTheDocument()
  })

  it('renders bluesky integration', () => {
    render(
      <TickerCard
        ticker={ticker({
          bluesky: {
            connected: true,
            active: true,
            handle: 'systemli.bsky.app',
            appKey: '',
          },
        })}
      />
    )

    expect(screen.getByText('Integrations')).toBeInTheDocument()
    expect(screen.getByText('Bluesky')).toBeInTheDocument()
  })

  it('renders signal group integration', () => {
    render(
      <TickerCard
        ticker={ticker({
          signalGroup: {
            connected: true,
            active: true,
            groupInviteLink: '',
            groupID: '',
          },
        })}
      />
    )

    expect(screen.getByText('Integrations')).toBeInTheDocument()
    expect(screen.getAllByText('Signal Group')).toHaveLength(2)
  })

  it('renders matrix integration', () => {
    render(
      <TickerCard
        ticker={ticker({
          matrix: {
            connected: true,
            active: true,
            roomID: '',
            roomName: '!systemli:matrix.org',
          },
        })}
      />
    )

    expect(screen.getByText('Integrations')).toBeInTheDocument()
    expect(screen.getByText('Matrix')).toBeInTheDocument()
  })
})
