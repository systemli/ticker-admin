import { render, screen, waitFor } from '@testing-library/react'
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
            <FeatureContext.Consumer>{value => <div>{value?.features.telegramEnabled.toString()}</div>}</FeatureContext.Consumer>
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
      expect(screen.getByText('true')).toBeInTheDocument()
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should handle error', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(token)
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error', error: { code: 500, message: 'Internal Server Error' } }))

    setup()

    expect(await screen.findByText('false')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
