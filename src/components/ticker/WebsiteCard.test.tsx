import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Ticker, TickerWebsite } from '../../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import WebsiteCard from './WebsiteCard'

describe('WebsiteCard', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  const component = ({ websites }: { websites: Array<TickerWebsite> }) => {
    return (
      <>
        <WebsiteCard
          ticker={
            {
              id: 1,
              websites: websites,
            } as Ticker
          }
        />
        <input name="Submit" type="submit" value="Submit" form="configureWebsites" />
      </>
    )
  }

  it('should render the component', async () => {
    renderWithProviders(component({ websites: [] }))

    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByText('No website origins configured.')).toBeInTheDocument()
  })

  it('should delete the origins', async () => {
    renderWithProviders(component({ websites: [{ origin: 'http://localhost', id: 1 }] }))

    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/tickers/1/websites', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'delete',
    })
  })

  it('should open the form', async () => {
    renderWithProviders(component({ websites: [] }))

    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Configure' }))

    expect(screen.getByRole('button', { name: 'Add Origin' })).toBeInTheDocument()
  })

  it('should fail when reponse fails', async () => {
    renderWithProviders(component({ websites: [{ origin: 'http://localhost', id: 1 }] }))

    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component({ websites: [{ origin: 'http://localhost', id: 1 }] }))

    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument()

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
