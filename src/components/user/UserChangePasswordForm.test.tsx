import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { adminToken, renderWithProviders, setMockToken } from '../../tests/utils'
import UserChangePasswordForm from './UserChangePasswordForm'

describe('UserChangePasswordForm', () => {
  beforeEach(() => {
    setMockToken(adminToken)
    fetchMock.resetMocks()
    onClose.mockClear()
    setSubmitting.mockClear()
  })

  const onClose = vi.fn()
  const setSubmitting = vi.fn()

  const component = () => {
    return (
      <>
        <UserChangePasswordForm id="changePasswordForm" onClose={onClose} setSubmitting={setSubmitting} />
        <input name="Submit" type="submit" value="Submit" form="changePasswordForm" />
      </>
    )
  }

  it('should render the component and change password successfully', async () => {
    renderWithProviders(component())

    expect(screen.getByLabelText('Password *')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Repeat new Password *')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Password *'), 'currentpassword')
    await userEvent.type(screen.getByLabelText('New Password'), 'newpassword10')
    await userEvent.type(screen.getByLabelText('Repeat new Password *'), 'newpassword10')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(setSubmitting).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/users/me', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify({
        password: 'currentpassword',
        newPassword: 'newpassword10',
        newPasswordValidate: 'newpassword10',
      }),
    })
  })

  it('should show error when password authentication fails', async () => {
    renderWithProviders(component())

    await userEvent.type(screen.getByLabelText('Password *'), 'wrongpassword')
    await userEvent.type(screen.getByLabelText('New Password'), 'newpassword10')
    await userEvent.type(screen.getByLabelText('Repeat new Password *'), 'newpassword10')

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'error',
        error: { code: 401, message: 'could not authenticate password' },
      })
    )

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onClose).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should fail when request fails', async () => {
    renderWithProviders(component())

    await userEvent.type(screen.getByLabelText('Password *'), 'currentpassword')
    await userEvent.type(screen.getByLabelText('New Password'), 'newpassword10')
    await userEvent.type(screen.getByLabelText('Repeat new Password *'), 'newpassword10')

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onClose).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
