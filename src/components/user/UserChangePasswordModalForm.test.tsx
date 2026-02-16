import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import UserChangePasswordModalForm from './UserChangePasswordModalForm'

describe('UserChangePasswordModalForm', () => {
  beforeEach(() => {
    setMockToken(userToken)
    onClose.mockClear()
    fetchMock.resetMocks()
  })

  const onClose = vi.fn()

  const component = (open: boolean) => {
    return <UserChangePasswordModalForm open={open} onClose={onClose} />
  }

  it('should render the form fields', async () => {
    renderWithProviders(component(true))

    expect(screen.getByLabelText('Password *')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Repeat new Password *')).toBeInTheDocument()

    // Check if the close button works
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should submit the form', async () => {
    renderWithProviders(component(true))

    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          user: {
            id: 1,
            createdAt: new Date(),
            email: 'louis@systemli.org',
            isSuperAdmin: true,
          },
        },
        status: 'success',
      })
    )

    await userEvent.type(screen.getByLabelText('Password *'), 'password')
    await userEvent.type(screen.getByLabelText('New Password'), 'newpassword')
    await userEvent.type(screen.getByLabelText('Repeat new Password *'), 'newpassword')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('/api/admin/users/me', {
      body: '{"password":"password","newPassword":"newpassword","newPasswordValidate":"newpassword"}',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should show an error message if the password is wrong', async () => {
    renderWithProviders(component(true))

    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: {
          message: 'could not authenticate password',
        },
        status: 'error',
      }),
      { status: 200 }
    )

    await userEvent.type(screen.getByLabelText('Password *'), 'password')
    await userEvent.type(screen.getByLabelText('New Password'), 'newpassword')
    await userEvent.type(screen.getByLabelText('Repeat new Password *'), 'newpassword')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClose).toHaveBeenCalledTimes(0)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Wrong password')).toBeInTheDocument()
  })

  it('should show an error message if the passwords do not match', async () => {
    renderWithProviders(component(true))

    await userEvent.type(screen.getByLabelText('Password *'), 'password')
    await userEvent.type(screen.getByLabelText('New Password'), 'newpassword')
    await userEvent.type(screen.getByLabelText('Repeat new Password *'), 'newpassword2')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClose).toHaveBeenCalledTimes(0)
    expect(fetch).toHaveBeenCalledTimes(0)
    expect(await screen.findByText('The passwords do not match')).toBeInTheDocument()
  })
})
