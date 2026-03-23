import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiResponse } from '../api/Api'
import { Ticker } from '../api/Ticker'
import { renderWithProviders, setMockToken, userToken } from '../tests/utils'
import useIntegrationActions from './useIntegrationActions'

interface Props {
  ticker: Ticker
  deleteApi: () => Promise<ApiResponse<unknown>>
  toggleApi?: () => Promise<ApiResponse<unknown>>
  active?: boolean
}

const TestComponent = ({ ticker, deleteApi, toggleApi, active }: Props) => {
  const { handleDelete, handleToggle } = useIntegrationActions({
    ticker,
    i18nPrefix: 'bluesky',
    deleteApi: () => deleteApi(),
    toggleApi: toggleApi ? () => toggleApi() : undefined,
    active,
  })

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      {handleToggle && <button onClick={handleToggle}>Toggle</button>}
    </>
  )
}

describe('useIntegrationActions', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  const ticker = { id: 1, title: 'Ticker 1' } as Ticker

  describe('handleDelete', () => {
    it('should call deleteApi on success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

      renderWithProviders(<TestComponent ticker={ticker} deleteApi={() => fetchMock('/api/admin/tickers/1/bluesky', { method: 'delete' }) as never} />)

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should handle error response on delete', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

      renderWithProviders(<TestComponent ticker={ticker} deleteApi={() => fetchMock('/api/admin/tickers/1/bluesky', { method: 'delete' }) as never} />)

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should handle request failure on delete', async () => {
      fetchMock.mockReject()

      renderWithProviders(<TestComponent ticker={ticker} deleteApi={() => fetchMock('/api/admin/tickers/1/bluesky', { method: 'delete' }) as never} />)

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('handleToggle', () => {
    it('should call toggleApi on success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

      renderWithProviders(
        <TestComponent
          ticker={ticker}
          deleteApi={() => Promise.resolve({ status: 'success' }) as never}
          toggleApi={() => fetchMock('/api/admin/tickers/1/bluesky', { method: 'put' }) as never}
          active={true}
        />
      )

      await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should handle error response on toggle', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

      renderWithProviders(
        <TestComponent
          ticker={ticker}
          deleteApi={() => Promise.resolve({ status: 'success' }) as never}
          toggleApi={() => fetchMock('/api/admin/tickers/1/bluesky', { method: 'put' }) as never}
          active={false}
        />
      )

      await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should handle request failure on toggle', async () => {
      fetchMock.mockReject()

      renderWithProviders(
        <TestComponent
          ticker={ticker}
          deleteApi={() => Promise.resolve({ status: 'success' }) as never}
          toggleApi={() => fetchMock('/api/admin/tickers/1/bluesky', { method: 'put' }) as never}
          active={true}
        />
      )

      await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })
})
