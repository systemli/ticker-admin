import { render, screen } from '@testing-library/react'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router'
import { AuthProvider, Roles } from './AuthContext'
import FeatureContext, { FeatureProvider } from './FeatureContext'

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
            <FeatureContext.Consumer>{value => <div>{value?.features.telegramEnabled.toString()}</div>}</FeatureContext.Consumer>
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

  it('should handle error', async () => {
    mockedLocalStorage.getItem = vi.fn(() => token)
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'error', error: { code: 500, message: 'Internal Server Error' } }))

    setup()

    expect(await screen.findByText('false')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
