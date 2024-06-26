import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import UsersView from './UsersView'

describe('UsersView', function () {
  const jwt = sign({ id: 1, email: 'louis@systemli.org', roles: ['admin', 'user'] }, 'secret')

  beforeEach(() => {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(jwt)
    fetchMock.resetMocks()
  })

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
          <NotificationProvider>
            <AuthProvider>
              <UsersView />
            </AuthProvider>
          </NotificationProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  test('renders list', async function () {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          users: [
            {
              id: 1,
              createdAt: new Date(),
              email: 'admin@systemli.org',
              isSuperAdmin: true,
            },
          ],
        },
      })
    )
    setup()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText('admin@systemli.org')).toBeInTheDocument()
  })

  test('open new users dialog', async function () {
    setup()
    fetchMock.mockIf(
      /\/v1\/admin\/users/i,
      JSON.stringify({
        data: {
          users: [],
        },
      })
    )
    fetchMock.mockIf(
      /\/v1\/admin\/tickers/i,
      JSON.stringify({
        data: {
          tickers: [],
        },
      })
    )

    const button = await screen.findByRole('button', { name: /new user/i })
    expect(button).toBeInTheDocument()

    await userEvent.click(button)

    const dialogTitle = await screen.findByText(/create user/i)
    expect(dialogTitle).toBeInTheDocument()

    const close = screen.getByRole('button', { name: /close/i })
    expect(close).toBeInTheDocument()

    await userEvent.click(close)

    expect(dialogTitle).not.toBeVisible()
  })

  test('open dialog for existing user', async function () {
    fetchMock.mockIf(
      /\/v1\/admin\/users/i,
      JSON.stringify({
        data: {
          users: [
            {
              id: 1,
              createdAt: new Date(),
              email: 'admin@systemli.org',
              isSuperAdmin: true,
            },
          ],
        },
      })
    )
    setup()

    expect(await screen.findByText('admin@systemli.org')).toBeInTheDocument()

    const menuButton = screen.getByTestId('usermenu')

    await userEvent.click(menuButton)

    const editButton = screen.getByTestId('usermenu-edit')

    expect(editButton).toBeVisible()

    await userEvent.click(editButton)

    expect(editButton).not.toBeVisible()

    const editTitle = screen.getByText(/update user/i)
    const editClose = screen.getByRole('button', { name: /close/i })

    expect(editTitle).toBeInTheDocument()
    expect(editClose).toBeInTheDocument()

    await userEvent.click(editClose)

    expect(editTitle).not.toBeVisible()

    await userEvent.click(menuButton)

    const deleteButton = screen.getByTestId('usermenu-delete')

    expect(deleteButton).toBeVisible()

    await userEvent.click(deleteButton)

    expect(deleteButton).not.toBeVisible()

    const deleteTitle = screen.getByText(/delete user/i)
    const deleteClose = screen.getByRole('button', { name: /close/i })

    expect(deleteTitle).toBeInTheDocument()
    expect(deleteClose).toBeInTheDocument()

    await userEvent.click(deleteClose)

    expect(deleteClose).not.toBeVisible()
  })

  test('user list could not fetched', async function () {
    fetchMock.mockReject(new Error('network error'))
    setup()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText('Oh no! An error occured')).toBeInTheDocument()
  })
})
