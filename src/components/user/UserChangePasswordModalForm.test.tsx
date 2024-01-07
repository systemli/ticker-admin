import { render, screen } from '@testing-library/react'
import UserChangePasswordModalForm from './UserChangePasswordModalForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../useAuth'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

describe('UserChangePasswordModalForm', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  function setup(open: boolean, onClose: () => void) {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    return render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <AuthProvider>
            <UserChangePasswordModalForm onClose={onClose} open={open} />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the form fields', async () => {
    const onClose = vi.fn()
    setup(true, onClose)

    expect(screen.getByLabelText('Password *')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Repeat new Password *')).toBeInTheDocument()

    // Check if the close button works
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should submit the form', async () => {
    const onClose = vi.fn()
    setup(true, onClose)

    fetch.mockResponseOnce(
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
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/v1/admin/users/me', {
      body: '{"password":"password","newPassword":"newpassword","newPasswordValidate":"newpassword"}',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ',
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should show an error message if the password is wrong', async () => {
    const onClose = vi.fn()
    setup(true, onClose)

    fetch.mockResponseOnce(
      JSON.stringify({
        error: {
          message: 'could not authenticate password',
        },
        status: 'error',
      }),
      { status: 401 }
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
    const onClose = vi.fn()
    setup(true, onClose)

    await userEvent.type(screen.getByLabelText('Password *'), 'password')
    await userEvent.type(screen.getByLabelText('New Password'), 'newpassword')
    await userEvent.type(screen.getByLabelText('Repeat new Password *'), 'newpassword2')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClose).toHaveBeenCalledTimes(0)
    expect(fetch).toHaveBeenCalledTimes(0)
    expect(await screen.findByText('The passwords do not match')).toBeInTheDocument()
  })
})
