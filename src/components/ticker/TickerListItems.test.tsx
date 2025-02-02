import { screen } from '@testing-library/react'
import { GetTickersQueryParams } from '../../api/Ticker'
import { adminToken, queryClient, setup } from '../../tests/utils'
import TickerListItems from './TickerListItems'

describe('TickerListItems', function () {
  beforeAll(() => {
    localStorage.setItem('token', adminToken)
  })

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const component = ({ params }: { params: GetTickersQueryParams }) => {
    return <TickerListItems params={params} token={adminToken} />
  }

  const params = { title: '', origin: '', active: undefined } as GetTickersQueryParams

  it('should render zero tickers', async function () {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { tickers: [] }, status: 'success' }))

    setup(queryClient, component({ params }))

    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('No tickers found.')).toBeInTheDocument()
  })

  it('should render tickers', async function () {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          tickers: [
            {
              id: 1,
              createdAt: new Date(),
              title: 'title',
              description: 'description',
              active: true,
              websites: [{ id: 1, origin: 'http://localhost' }],
            },
          ],
        },
        status: 'success',
      })
    )

    setup(queryClient, component({ params }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('title')).toBeInTheDocument()
    expect(await screen.findByText('http://localhost')).toBeInTheDocument()
  })

  it('should render error message', async function () {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error', error: { code: 500, message: 'Internal Server Error' } }))

    setup(queryClient, component({ params }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Unable to fetch tickers from server.')).toBeInTheDocument()
  })

  it('should fail when request fails', async () => {
    fetchMock.mockReject()

    setup(queryClient, component({ params }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Unable to fetch tickers from server.')).toBeInTheDocument()
  })
})
