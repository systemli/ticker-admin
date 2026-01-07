import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import SettingsView from './SettingsView'

describe('SettingsView', function () {
  const jwt = sign({ id: 1, email: 'louis@systemli.org', roles: ['admin', 'user'] }, 'secret')
  const inactiveSettingsResponse = JSON.stringify({
    data: {
      setting: {
        id: 1,
        name: 'inactive_settings',
        value: {
          headline: 'headline',
          sub_headline: 'sub_headline',
          description: 'description',
          author: 'author',
          email: 'email',
          homepage: 'homepage',
          twitter: 'twitter',
        },
      },
    },
  })

  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReturnValue(jwt)
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
              <SettingsView />
            </AuthProvider>
          </NotificationProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  test('renders settings and open dialogs', async function () {
    fetchMock.mockIf(/^http:\/\/localhost:8080\/.*$/, (request: Request) => {
      if (request.url.endsWith('/admin/settings/inactive_settings')) {
        return Promise.resolve(inactiveSettingsResponse)
      }

      return Promise.resolve(
        JSON.stringify({
          data: [],
          status: 'error',
          error: 'error message',
        })
      )
    })

    setup()

    const loaders = screen.getAllByText(/loading/i)
    expect(loaders).toHaveLength(1)
    loaders.forEach(loader => {
      expect(loader).toBeInTheDocument()
    })

    expect(await screen.findByText('headline')).toBeInTheDocument()

    const inactiveSettingEditButton = screen.getByTestId('inactivesetting-edit')
    expect(inactiveSettingEditButton).toBeInTheDocument()

    await userEvent.click(inactiveSettingEditButton)

    const inactiveSettingsDialogTitle = screen.getByText('Edit Inactive Settings')
    expect(inactiveSettingsDialogTitle).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(inactiveSettingsDialogTitle).not.toBeVisible()
  })

  test('settings could not fetched', async function () {
    fetchMock.mockReject(new Error('network error'))
    setup()

    const loaders = screen.getAllByText(/loading/i)
    expect(loaders).toHaveLength(1)
    loaders.forEach(loader => {
      expect(loader).toBeInTheDocument()
    })
    expect(await screen.findByText('Oh no! An error occurred')).toBeInTheDocument()
  })
})
