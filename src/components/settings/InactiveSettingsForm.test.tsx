import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { InactiveSetting, Setting } from '../../api/Settings'
import { adminToken, renderWithProviders, setMockToken } from '../../tests/utils'
import InactiveSettingsForm from './InactiveSettingsForm'

describe('InactiveSettingsForm', () => {
  beforeEach(() => {
    setMockToken(adminToken)
    fetchMock.resetMocks()
    callback.mockClear()
    setSubmitting.mockClear()
  })

  const callback = vi.fn()
  const setSubmitting = vi.fn()

  const component = (setting: Setting<InactiveSetting>) => {
    return (
      <>
        <InactiveSettingsForm name="inactiveSettingForm" setting={setting} callback={callback} setSubmitting={setSubmitting} />
        <input name="Submit" type="submit" value="Submit" form="inactiveSettingForm" />
      </>
    )
  }

  it('should render the component', async () => {
    const setting = {
      id: 1,
      name: 'inactive_setting',
      value: {} as InactiveSetting,
    } as Setting<InactiveSetting>
    renderWithProviders(component(setting))

    expect(screen.getByRole('textbox', { name: 'Headline' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Subheadline' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Author' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Homepage' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'E-Mail' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Twitter' })).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox', { name: 'Headline' }), 'Headline')
    await userEvent.type(screen.getByRole('textbox', { name: 'Subheadline' }), 'Subheadline')
    await userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'Description')
    await userEvent.type(screen.getByRole('textbox', { name: 'Author' }), 'Author')
    await userEvent.type(screen.getByRole('textbox', { name: 'Homepage' }), 'https://example.org')
    await userEvent.type(screen.getByRole('textbox', { name: 'E-Mail' }), 'user@example.org')
    await userEvent.type(screen.getByRole('textbox', { name: 'Twitter' }), 'user')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(1)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/settings/inactive_settings', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headline: 'Headline',
        subHeadline: 'Subheadline',
        description: 'Description',
        author: 'Author',
        email: 'user@example.org',
        homepage: 'https://example.org',
        twitter: 'user',
      }),
      method: 'put',
    })
  })

  it('should fail when request fails', async () => {
    const setting = {
      id: 1,
      name: 'inactive_setting',
      value: {
        headline: 'Headline',
        subHeadline: 'Subheadline',
        description: 'Description',
        author: 'Author',
        email: 'user@example.org',
        homepage: 'https://example.org',
        twitter: 'user',
      } as InactiveSetting,
    } as Setting<InactiveSetting>
    renderWithProviders(component(setting))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    const setting = {
      id: 1,
      name: 'inactive_setting',
      value: {
        headline: 'Headline',
        subHeadline: 'Subheadline',
        description: 'Description',
        author: 'Author',
        email: 'user@example.org',
        homepage: 'https://example.org',
        twitter: 'user',
      } as InactiveSetting,
    } as Setting<InactiveSetting>
    renderWithProviders(component(setting))

    fetchMock.mockRejectOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toHaveBeenCalledTimes(0)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
