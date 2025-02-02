import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { RefreshIntervalSetting, Setting } from '../../api/Settings'
import { adminToken, queryClient, setup } from '../../tests/utils'
import RefreshIntervalForm from './RefreshIntervalForm'

describe('RefreshIntervalForm', () => {
  beforeAll(() => {
    localStorage.setItem('token', adminToken)
  })

  beforeEach(() => {
    fetchMock.resetMocks()
    callback.mockClear()
    setSubmitting.mockClear()
  })

  const callback = vi.fn()
  const setSubmitting = vi.fn()

  const component = () => {
    const setting = {
      id: 1,
      name: 'refresh_interval',
      value: { refreshInterval: '60' } as RefreshIntervalSetting,
    } as Setting<RefreshIntervalSetting>

    return (
      <>
        <RefreshIntervalForm name="refreshIntervalForm" setting={setting} callback={callback} setSubmitting={setSubmitting} />
        <input name="Submit" type="submit" value="Submit" form="refreshIntervalForm" />
      </>
    )
  }

  it('should render the component', async () => {
    setup(queryClient, component())

    expect(screen.getByLabelText('Interval *')).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Interval *'))
    await userEvent.type(screen.getByLabelText('Interval *'), '120')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/settings/refresh_interval', {
      body: JSON.stringify({ refreshInterval: 120 }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should handle a failed request', async () => {
    setup(queryClient, component())

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should handle a network error', async () => {
    setup(queryClient, component())

    fetchMock.mockRejectOnce(new Error('Network error'))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
