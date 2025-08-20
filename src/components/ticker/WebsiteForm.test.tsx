import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker, TickerWebsite } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import WebsiteForm from './WebsiteForm'

describe('WebsiteForm', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
    callback.mockClear()
  })

  const callback = vi.fn()

  const component = ({ websites }: { websites: Array<TickerWebsite> }) => {
    return (
      <>
        <WebsiteForm
          ticker={
            {
              id: 1,
              websites: websites,
            } as Ticker
          }
          callback={callback}
        />
        <input name="Submit" type="submit" value="Submit" form="configureWebsites" />
      </>
    )
  }

  it('should render the component', async () => {
    renderWithProviders(component({ websites: [] }))

    expect(screen.getByRole('button', { name: 'Add Origin' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Add Origin' }))

    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://example.com')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/websites', {
      body: JSON.stringify({ websites: [{ origin: 'https://example.com' }] }),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should fail when URL is already exists', async () => {
    renderWithProviders(component({ websites: [] }))

    expect(screen.getByRole('button', { name: 'Add Origin' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Add Origin' }))

    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://example.com')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ websites: [] }))

    expect(screen.getByRole('button', { name: 'Add Origin' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Add Origin' }))

    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('https://example.com'), 'https://example.com')

    fetchMock.mockRejectOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
