import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'
import * as api from '../api/Auth'
import { AuthProvider } from '../contexts/AuthContext'
import LoginView from './LoginView'

function setup() {
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
          <LoginView />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('LoginView', function () {
  test('login successful', async function () {
    const jwt = sign({ id: 1, email: 'louis@systemli.org', roles: ['admin', 'user'] }, 'secret')
    vi.spyOn(api, 'login').mockResolvedValue({ code: 200, token: jwt, expire: new Date() })
    setup()

    const email = screen.getByTestId('email').querySelector('input') as HTMLInputElement
    const password = screen.getByTestId('password').querySelector('input') as HTMLInputElement
    const submit = screen.getByTestId('submit') as HTMLElement

    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
    expect(submit).toBeInTheDocument()

    await userEvent.type(email, 'louis@systemli.org')
    await userEvent.type(password, 'password')
    await userEvent.click(submit)

    expect(api.login).toHaveBeenCalledWith('louis@systemli.org', 'password')

    // Wait for any async updates to complete
    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('louis@systemli.org', 'password')
    })
  })

  test('login failed', async function () {
    vi.spyOn(api, 'login').mockRejectedValue(new Error('Login failed'))
    setup()

    const email = screen.getByTestId('email').querySelector('input') as HTMLInputElement
    const password = screen.getByTestId('password').querySelector('input') as HTMLInputElement
    const submit = screen.getByTestId('submit') as HTMLElement

    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
    expect(submit).toBeInTheDocument()

    await userEvent.type(email, 'louis@systemli.org')
    await userEvent.type(password, 'password')
    await userEvent.click(submit)

    expect(api.login).toHaveBeenCalledWith('louis@systemli.org', 'password')
    expect(await screen.findByText('Login failed')).toBeInTheDocument()
  })
})
