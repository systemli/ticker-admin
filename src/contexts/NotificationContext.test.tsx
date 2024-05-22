import { render, screen } from '@testing-library/react'
import NotificationContext, { NotificationProvider } from './NotificationContext'

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function setup() {
    return render(
      <NotificationProvider>
        <NotificationContext.Consumer>
          {value => (
            <div>
              {value?.notification?.content}
              {value?.isOpen?.toString()}
            </div>
          )}
        </NotificationContext.Consumer>
      </NotificationProvider>
    )
  }

  it('should render', async () => {
    setup()

    expect(await screen.findByText('false')).toBeInTheDocument()
  })
})
