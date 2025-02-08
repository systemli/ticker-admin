import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Message } from '../../api/Message'
import { queryClient, setup, userToken } from '../../tests/utils'
import MessageModalDelete from './MessageModalDelete'

describe('MessageModalDelete', () => {
  beforeAll(() => {
    localStorage.setItem('token', userToken)
  })

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const onClose = vi.fn()

  const component = (open: boolean) => {
    const message: Message = { id: 1, ticker: 1, text: 'Hello', createdAt: new Date(), geoInformation: '' }

    return <MessageModalDelete message={message} onClose={onClose} open={open} />
  }

  it('should render the modal', async () => {
    setup(queryClient, component(true))

    expect(screen.getByText('Delete Message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('should close the modal', async () => {
    setup(queryClient, component(true))

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should delete the message', async () => {
    setup(queryClient, component(true))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/messages/1', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'delete',
    })
  })

  it('should fail when response is not success', async () => {
    setup(queryClient, component(true))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    setup(queryClient, component(true))

    fetchMock.mockRejectOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
