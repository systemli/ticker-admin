import { render, screen } from '@testing-library/react'
import FeatureContext, { FeatureProvider } from './FeatureContext'
import { AuthProvider, Roles } from './AuthContext'
import { MemoryRouter } from 'react-router'
import sign from 'jwt-encode'

const exp = Math.floor(Date.now() / 1000) + 5000
const token = sign({ id: 1, email: 'user@example.org', roles: ['user'] as Array<Roles>, exp: exp }, 'secret')

const mockedLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
global.localStorage = mockedLocalStorage

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
            <FeatureContext.Consumer>{value => <div>{value?.telegramEnabled.toString()}</div>}</FeatureContext.Consumer>
          </FeatureProvider>
        </AuthProvider>
      </MemoryRouter>
    )
  }

  it('should render', async () => {
    mockedLocalStorage.getItem = vi.fn(() => token)
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success', data: { features: { telegramEnabled: true } } }))

    setup()

    expect(await screen.findByText('true')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
