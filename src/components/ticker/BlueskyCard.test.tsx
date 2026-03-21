import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import BlueskyCard from './BlueskyCard'

describe('BlueSkyCard', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  const ticker = ({
    active,
    connected,
    handle = '',
    appKey = '',
    replyRestriction = '',
  }: {
    active: boolean
    connected: boolean
    handle?: string
    appKey?: string
    replyRestriction?: string
  }) => {
    return {
      id: 1,
      bluesky: {
        active: active,
        connected: connected,
        handle: handle,
        appKey: appKey,
        replyRestriction: replyRestriction,
      },
    } as Ticker
  }

  const component = ({ ticker }: { ticker: Ticker }) => {
    return <BlueskyCard ticker={ticker} />
  }

  it('should render the component when not connected', () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('Bluesky')).toBeInTheDocument()
    expect(screen.getByText('Publishes messages to your Bluesky profile.')).toBeInTheDocument()
    expect(screen.getByText('Not configured')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Disable' })).not.toBeInTheDocument()
  })

  it('should render the component when connected and active', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, handle: 'handle.bsky.social' }) }))

    expect(screen.getByText('Bluesky')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'handle.bsky.social' })).toBeInTheDocument()
    expect(screen.getByText('Reply Restriction')).toBeInTheDocument()
    expect(screen.getByText('Anyone')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Disable' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/bluesky', {
      body: JSON.stringify({ active: false }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      method: 'put',
    })

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/bluesky', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      method: 'delete',
    })

    await userEvent.click(screen.getByRole('button', { name: 'Configure' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display reply restriction "followers" when connected', () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, handle: 'handle.bsky.social', replyRestriction: 'followers' }) }))

    expect(screen.getByText('Reply Restriction')).toBeInTheDocument()
    expect(screen.getByText('Followers only')).toBeInTheDocument()
  })

  it('should display reply restriction "following" when connected', () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, handle: 'handle.bsky.social', replyRestriction: 'following' }) }))

    expect(screen.getByText('Reply Restriction')).toBeInTheDocument()
    expect(screen.getByText('People you follow')).toBeInTheDocument()
  })

  it('should display reply restriction "mentioned" when connected', () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, handle: 'handle.bsky.social', replyRestriction: 'mentioned' }) }))

    expect(screen.getByText('Reply Restriction')).toBeInTheDocument()
    expect(screen.getByText('Mentioned users only')).toBeInTheDocument()
  })

  it('should display reply restriction "nobody" when connected', () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, handle: 'handle.bsky.social', replyRestriction: 'nobody' }) }))

    expect(screen.getByText('Reply Restriction')).toBeInTheDocument()
    expect(screen.getByText('Nobody')).toBeInTheDocument()
  })

  it('should render Enable button when connected but inactive', async () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: true, handle: 'handle.bsky.social' }) }))

    expect(screen.getByText('Inactive')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enable' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Disable' })).not.toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Enable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/bluesky', {
      body: JSON.stringify({ active: true }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      method: 'put',
    })
  })

  it('should handle delete failure', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true }) }))

    fetchMock.mockRejectOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should handle delete error response', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true }) }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when response fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true }) }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true }) }))

    fetchMock.mockRejectOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
