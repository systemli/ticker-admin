import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import BlueskyForm from './BlueskyForm'

describe('BlueskyForm', () => {
  beforeEach(() => {
    setMockToken(userToken)
    callback.mockClear()
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

  const callback = vi.fn()

  const component = ({ ticker }: { ticker: Ticker }) => {
    return (
      <>
        <BlueskyForm callback={callback} ticker={ticker} />
        <input name="Submit" type="submit" value="Submit" form="configureBluesky" />
      </>
    )
  }

  it('should render the component', async () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('You need to create a application password in Bluesky.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Handle' })).toBeInTheDocument()
    expect(screen.getByLabelText('Application Password *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Handle' }), 'handle.bsky.social')
    await userEvent.type(screen.getByLabelText('Application Password *'), 'password')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/bluesky', {
      body: '{"active":true,"handle":"handle.bsky.social","appKey":"password"}',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should fail when response fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Handle' }), 'handle.bsky.social')
    await userEvent.type(screen.getByLabelText('Application Password *'), 'password')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ ticker: ticker({ active: false, connected: false }) }))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Active' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Handle' }), 'handle.bsky.social')
    await userEvent.type(screen.getByLabelText('Application Password *'), 'password')

    fetchMock.mockRejectOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
