import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Setting, TelegramSetting } from '../../api/Settings'
import { adminToken, renderWithProviders, setMockToken } from '../../tests/utils'
import TelegramSettingsForm from './TelegramSettingsForm'

describe('TelegramSettingsForm', () => {
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

  const component = (setting: Setting<TelegramSetting>) => {
    return (
      <>
        <TelegramSettingsForm name="telegramSettingForm" setting={setting} callback={callback} setSubmitting={setSubmitting} onSaved={onSaved} />
        <input name="Submit" type="submit" value="Submit" form="telegramSettingForm" />
      </>
    )
  }

  it('should render the component', async () => {
    const setting = {
      id: 1,
      name: 'telegram_settings',
      value: { token: '', botUsername: '' } as TelegramSetting,
    } as Setting<TelegramSetting>
    renderWithProviders(component(setting))

    expect(screen.getByLabelText('Bot Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Bot Token')).toBeInTheDocument()
  })

  it('should submit the form', async () => {
    const setting = {
      id: 1,
      name: 'telegram_settings',
      value: { token: '****wxyz', botUsername: 'test_bot' } as TelegramSetting,
    } as Setting<TelegramSetting>
    renderWithProviders(component(setting))

    await userEvent.type(screen.getByLabelText('Bot Token'), '123456:ABC-DEF')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/settings/telegram_settings', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: '123456:ABC-DEF' }),
      method: 'put',
    })
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it('should fail when response fails', async () => {
    const setting = {
      id: 1,
      name: 'telegram_settings',
      value: { token: '****wxyz', botUsername: 'test_bot' } as TelegramSetting,
    } as Setting<TelegramSetting>
    renderWithProviders(component(setting))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    const setting = {
      id: 1,
      name: 'telegram_settings',
      value: { token: '****wxyz', botUsername: 'test_bot' } as TelegramSetting,
    } as Setting<TelegramSetting>
    renderWithProviders(component(setting))

    fetchMock.mockRejectOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
