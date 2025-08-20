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

  const ticker = ({ active, connected, handle = '', appKey = '' }: { active: boolean; connected: boolean; handle?: string; appKey?: string }) => {
    return {
      id: 1,
      bluesky: {
        active: active,
        connected: connected,
        handle: handle,
        appKey: appKey,
      },
    } as Ticker
  }

  const component = ({ ticker }: { ticker: Ticker }) => {
    return <BlueskyCard ticker={ticker} />
  }

  it('should render the component', () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('Bluesky')).toBeInTheDocument()
    expect(screen.getByText('You are not connected with Bluesky.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
  })

  it('should render the component when connected and active', async () => {
    renderWithProviders(component({ ticker: ticker({ active: true, connected: true, handle: 'handle.bsky.social' }) }))

    expect(screen.getByText('Bluesky')).toBeInTheDocument()
    expect(screen.getByText('You are connected with Bluesky.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'handle.bsky.social' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Disable' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Disable' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/bluesky', {
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
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/bluesky', {
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
