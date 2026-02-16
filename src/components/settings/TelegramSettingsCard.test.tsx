import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../contexts/AuthContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import { adminToken, setMockToken } from '../../tests/utils'
import TelegramSettingsCard from './TelegramSettingsCard'

describe('TelegramSettingsCard', () => {
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
              <TelegramSettingsCard />
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
            id: 1,
            name: 'telegram_settings',
            value: { token: '****wxyz', botUsername: 'test_bot' },
          },
        },
        status: 'success',
      })
    )

    render(component())

    await waitFor(() => {
      expect(screen.getByText('Telegram')).toBeInTheDocument()
    })

    expect(screen.getByText('test_bot')).toBeInTheDocument()
    expect(screen.getByText('****wxyz')).toBeInTheDocument()
    expect(screen.getByTestId('telegramsetting-edit')).toBeInTheDocument()
  })

  it('should open the edit modal', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          setting: {
            id: 1,
            name: 'telegram_settings',
            value: { token: '****wxyz', botUsername: 'test_bot' },
          },
        },
        status: 'success',
      })
    )

    render(component())

    await waitFor(() => {
      expect(screen.getByTestId('telegramsetting-edit')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByTestId('telegramsetting-edit'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should show error when fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Failed'))

    render(component())

    await waitFor(() => {
      expect(screen.getByText('Unable to fetch telegram settings from server.')).toBeInTheDocument()
    })
  })
})
