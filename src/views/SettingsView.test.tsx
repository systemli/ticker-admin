import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../components/useAuth'
import sign from 'jwt-encode'
import SettingsView from './SettingsView'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

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
  const refreshIntervalResponse = JSON.stringify({
    data: {
      setting: {
        id: 2,
        name: 'refresh_interval',
        value: 10000,
      },
    },
  })

  beforeEach(() => {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(jwt)
    fetch.resetMocks()
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
          <AuthProvider>
            <SettingsView />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  test('renders settings and open dialogs', async function () {
    fetch.mockIf(/^http:\/\/localhost:8080\/.*$/, (request: Request) => {
      if (request.url.endsWith('/admin/settings/inactive_settings')) {
        return Promise.resolve(inactiveSettingsResponse)
      }
      if (request.url.endsWith('/admin/settings/refresh_interval')) {
        return Promise.resolve(refreshIntervalResponse)
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
    expect(loaders).toHaveLength(2)
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

    const refreshIntervalEditButton = screen.getByTestId('refreshinterval-edit')
    expect(refreshIntervalEditButton).toBeInTheDocument()

    await userEvent.click(refreshIntervalEditButton)

    const refreshIntervalDialogTitle = screen.getByText('Edit Refresh Interval')
    expect(refreshIntervalDialogTitle).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(refreshIntervalDialogTitle).not.toBeVisible()
  })

  test('settings could not fetched', async function () {
    fetch.mockReject(new Error('network error'))
    setup()

    const loaders = screen.getAllByText(/loading/i)
    expect(loaders).toHaveLength(2)
    loaders.forEach(loader => {
      expect(loader).toBeInTheDocument()
    })
    expect(await screen.findByText('Oh no! An error occured')).toBeInTheDocument()
  })
})
