import { render, screen } from '@testing-library/react'
import { NotificationProvider } from '../contexts/NotificationContext'
import Notification from './Notification'

vi.mock('../contexts/useNotification', () => ({
  __esModule: true,
  default: () => ({
    isOpen: true,
    notification: { content: 'Hello, World!' },
    closeNotification: vi.fn(),
  }),
}))

describe('Notification', () => {
  function setup() {
    return render(
      <NotificationProvider>
        <Notification />
      </NotificationProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render empty notification', () => {
    setup()
  })

  it('should render a notification', () => {
    setup()

    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })
})
