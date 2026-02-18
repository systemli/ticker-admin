import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import { adminToken, setMockToken } from '../../tests/utils'
import SignalGroupSettingsCard from './SignalGroupSettingsCard'

describe('SignalGroupSettingsCard', () => {
  beforeEach(() => {
    setMockToken(adminToken)
    fetchMock.resetMocks()
  })

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const component = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <NotificationProvider>
              <SignalGroupSettingsCard />
            </NotificationProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render the component with data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          setting: {
            id: 3,
            name: 'signal_group_settings',
            value: {
              apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
              account: '+1234567890',
              avatar: '/path/to/avatar.png',
            },
          },
        },
        status: 'success',
      })
    )

    render(component())

    await waitFor(() => {
      expect(screen.getByText('Signal Group')).toBeInTheDocument()
    })

    expect(screen.getByText('https://signal-cli.example.org/api/v1/rpc')).toBeInTheDocument()
    expect(screen.getByText('+1234567890')).toBeInTheDocument()
    expect(screen.getByText('/path/to/avatar.png')).toBeInTheDocument()
    expect(screen.getByTestId('signalgroupsetting-edit')).toBeInTheDocument()
  })

  it('should open the edit modal', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          setting: {
            id: 3,
            name: 'signal_group_settings',
            value: {
              apiUrl: 'https://signal-cli.example.org/api/v1/rpc',
              account: '+1234567890',
              avatar: '/path/to/avatar.png',
            },
          },
        },
        status: 'success',
      })
    )

    render(component())

    await waitFor(() => {
      expect(screen.getByTestId('signalgroupsetting-edit')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByTestId('signalgroupsetting-edit'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should show error when fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Failed'))

    render(component())

    await waitFor(() => {
      expect(screen.getByText('Unable to fetch signal group settings from server.')).toBeInTheDocument()
    })
  })
})
