import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Setting, SignalGroupSetting } from '../../api/Settings'
import { adminToken, renderWithProviders, setMockToken } from '../../tests/utils'
import SignalGroupSettingsForm from './SignalGroupSettingsForm'

describe('SignalGroupSettingsForm', () => {
  beforeEach(() => {
    setMockToken(adminToken)
    fetchMock.resetMocks()
    callback.mockClear()
    setSubmitting.mockClear()
    onSaved.mockClear()
  })

  const callback = vi.fn()
  const setSubmitting = vi.fn()
  const onSaved = vi.fn()

  const component = (setting: Setting<SignalGroupSetting>) => {
    return (
      <>
        <SignalGroupSettingsForm name="signalGroupSettingForm" setting={setting} callback={callback} setSubmitting={setSubmitting} onSaved={onSaved} />
        <input name="Submit" type="submit" value="Submit" form="signalGroupSettingForm" />
      </>
    )
  }

  it('should render the component', async () => {
    const setting = {
      id: 3,
      name: 'signal_group_settings',
      value: { apiUrl: '', account: '', avatar: '' } as SignalGroupSetting,
    } as Setting<SignalGroupSetting>
    renderWithProviders(component(setting))

    expect(screen.getByLabelText('API URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Avatar')).toBeInTheDocument()
  })

  it('should submit the form', async () => {
    const setting = {
      id: 3,
      name: 'signal_group_settings',
      value: { apiUrl: '', account: '', avatar: '' } as SignalGroupSetting,
    } as Setting<SignalGroupSetting>
    renderWithProviders(component(setting))

    await userEvent.type(screen.getByLabelText('API URL'), 'https://signal-cli.example.org/api/v1/rpc')
    await userEvent.type(screen.getByLabelText('Account'), '+1234567890')
    await userEvent.type(screen.getByLabelText('Avatar'), '/path/to/avatar.png')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/settings/signal_group_settings', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
        account: '+1234567890',
        avatar: '/path/to/avatar.png',
      }),
      method: 'put',
    })
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it('should fail when response fails', async () => {
    const setting = {
      id: 3,
      name: 'signal_group_settings',
      value: { apiUrl: '', account: '', avatar: '' } as SignalGroupSetting,
    } as Setting<SignalGroupSetting>
    renderWithProviders(component(setting))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    const setting = {
      id: 3,
      name: 'signal_group_settings',
      value: { apiUrl: '', account: '', avatar: '' } as SignalGroupSetting,
    } as Setting<SignalGroupSetting>
    renderWithProviders(component(setting))

    fetchMock.mockRejectOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
