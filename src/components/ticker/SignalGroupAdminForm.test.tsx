import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Ticker } from '../../api/Ticker'
import { queryClient, setup, userToken } from '../../tests/utils'
import SignalGroupAdminForm from './SignalGroupAdminForm'

describe('SignalGroupAdminForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', userToken)
  })

  beforeEach(() => {
    callback.mockClear()
    fetchMock.resetMocks()
  })

  const ticker = ({ active, connected }: { active: boolean; connected: boolean }) => {
    return {
      id: 1,
      signalGroup: {
        active: active,
        connected: connected,
      },
    } as Ticker
  }

  const callback = vi.fn()
  const setSubmitting = vi.fn()

  const component = ({ ticker }: { ticker: Ticker }) => {
    return (
      <>
        <SignalGroupAdminForm callback={callback} ticker={ticker} setSubmitting={setSubmitting} />
        <input name="Submit" type="submit" value="Submit" form="configureSignalGroupAdmin" />
      </>
    )
  }

  it('should render the component', async () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('Only do this if extra members with write access are needed.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Phone number' })).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox', { name: 'Phone number' }), '+49123456789')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/signal_group/admin', {
      body: '{"number":"+49123456789"}',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should render the error message', async () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    expect(screen.getByText('Only do this if extra members with write access are needed.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Phone number' })).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox', { name: 'Phone number' }), '+49123456789')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }), { status: 400 })

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(screen.getByText('Failed to add number to Signal group')).toBeInTheDocument()
  })

  it('should fail when request fails', async () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    await userEvent.type(screen.getByRole('textbox', { name: 'Phone number' }), '+49123456789')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    setup(queryClient, component({ ticker: ticker({ active: false, connected: false }) }))

    await userEvent.type(screen.getByRole('textbox', { name: 'Phone number' }), '+49123456789')

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
