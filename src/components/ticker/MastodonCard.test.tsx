import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import MastodonCard from './MastodonCard'

describe('MastodonCard', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  const ticker = ({ active, connected, name = '' }: { active: boolean; connected: boolean; name?: string }) => {
    return {
      id: 1,
      mastodon: {
        active: active,
        connected: connected,
        name: name,
        server: 'https://mastodon.social',
      },
    } as Ticker
  }

  const component = ({ ticker }: { ticker: Ticker }) => {
    return <MastodonCard ticker={ticker} />
  }

  it('should render the component', () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('Mastodon')).toBeInTheDocument()
    expect(screen.getByText('You are not connected with Mastodon.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
  })

  it('should render the component when connected and active', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, name: 'user' }) }))

    expect(screen.getByText('Mastodon')).toBeInTheDocument()
    expect(screen.getByText('You are connected with Mastodon.')).toBeInTheDocument()
    expect(screen.getByText('Your Profile:')).toBeInTheDocument()
    expect(screen.getByText('@user@mastodon.social')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Disable' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/mastodon', {
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
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/mastodon', {
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

  it('should fail when response fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, name: 'user' }) }))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, name: 'user' }) }))

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
