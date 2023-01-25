import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../components/useAuth'
import LoginView from './LoginView'
import * as api from '../api/Auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import sign from 'jwt-encode'

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
    const jwt = sign(
      { id: 1, email: 'louis@systemli.org', roles: ['admin', 'user'] },
      'secret'
    )
    jest
      .spyOn(api, 'login')
      .mockResolvedValue({ code: 200, token: jwt, expire: new Date() })
    setup()

    const email = screen
      .getByTestId('email')
      .querySelector('input') as HTMLInputElement
    const password = screen
      .getByTestId('password')
      .querySelector('input') as HTMLInputElement
    const submit = screen.getByTestId('submit') as HTMLElement

    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
    expect(submit).toBeInTheDocument()

    await userEvent.type(email, 'louis@systemli.org')
    await userEvent.type(password, 'password')
    await userEvent.click(submit)

    expect(api.login).toHaveBeenCalledWith('louis@systemli.org', 'password')
  })

  test('login failed', async function () {
    jest.spyOn(api, 'login').mockRejectedValue(new Error('Login failed'))
    setup()

    const email = screen
      .getByTestId('email')
      .querySelector('input') as HTMLInputElement
    const password = screen
      .getByTestId('password')
      .querySelector('input') as HTMLInputElement
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
