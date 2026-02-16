import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { AuthProvider, Roles } from './AuthContext'
import FeatureContext, { FeatureProvider } from './FeatureContext'

const exp = Math.floor(Date.now() / 1000) + 5000
const token = sign({ id: 1, email: 'user@example.org', roles: ['user'] as Array<Roles>, exp: exp }, 'secret')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('FeatureContext', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  function setup() {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <FeatureProvider>
            <FeatureContext.Consumer>
              {value => (
                <div>
                  <span data-testid="value">{value?.features.telegramEnabled.toString()}</span>
                  <button onClick={() => value?.refreshFeatures()}>Refresh</button>
                </div>
              )}
            </FeatureContext.Consumer>
          </FeatureProvider>
        </AuthProvider>
      </MemoryRouter>
    )
  }

  it('should render', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(token)
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success', data: { features: { telegramEnabled: true } } }))

    setup()

    // Wait for both AuthProvider and FeatureProvider to initialize
    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('true')
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should handle error', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(token)
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error', error: { code: 500, message: 'Internal Server Error' } }))

    setup()

    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('false')
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should refresh features when refreshFeatures is called', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(token)
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success', data: { features: { telegramEnabled: false } } }))

    setup()

    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('false')
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Now simulate the token being configured on the backend
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success', data: { features: { telegramEnabled: true } } }))

    await userEvent.click(screen.getByRole('button', { name: 'Refresh' }))

    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('true')
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
