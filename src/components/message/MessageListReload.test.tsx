import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { queryClient, setup } from '../../tests/utils'
import MessageListReload from './MessageListReload'

describe('MessageListReload', () => {
  const ticker = { id: 1 } as Ticker

  it('should render', async () => {
    setup(queryClient, <MessageListReload ticker={ticker} />)

    vi.spyOn(queryClient, 'invalidateQueries')

    expect(screen.getByRole('button', { name: 'reload' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'reload' }))

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(1)
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['messages', ticker.id] })
  })
})
