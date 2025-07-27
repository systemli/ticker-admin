import { renderHook, waitFor } from '@testing-library/react'
import sign from 'jwt-encode'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { AuthProvider, Roles } from './AuthContext'
import useAuth from './useAuth'

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
  fetchMock.resetMocks()
  vi.clearAllMocks()
})

describe('useAuth', () => {
  it('throws error when not rendered within AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within a AuthProvider')
  })

  it('returns initial values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      ),
    })

    expect(result.current.user).toEqual(undefined)
    expect(result.current.token).toEqual('')
  })

  it('returns user and token when stored in localStorage', async () => {
    mockedLocalStorage.getItem = vi.fn(() => token)

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      ),
    })

    await new Promise(resolve => setTimeout(resolve, 0)).then(() => {})

    expect(result.current.error).toEqual(undefined)
    expect(result.current.user).toEqual({ id: 1, email: 'user@example.org', roles: ['user'], exp: exp })
    expect(result.current.token).toEqual(token)
  })

  it('returns user and token after login', async () => {
    mockedLocalStorage.getItem = vi.fn(() => null)
    fetchMock.mockResponseOnce(JSON.stringify({ code: 200, token: token, expire: exp }))

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      ),
    })

    result.current.login('user@example.org', 'password')

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/login', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({ username: 'user@example.org', password: 'password' }),
    })

    await new Promise(resolve => setTimeout(resolve, 0)).then(() => {})

    expect(result.current.user).toEqual({ id: 1, email: 'user@example.org', roles: ['user'], exp: exp })
    expect(result.current.token).toEqual(token)
    expect(result.current.error).toEqual(undefined)
  })

  it('returns error after failed login', async () => {
    mockedLocalStorage.getItem = vi.fn(() => null)
    fetchMock.mockRejectOnce(new Error('Login failed'))

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      ),
    })

    result.current.login('user@example.org', 'password')

    await new Promise(resolve => setTimeout(resolve, 0)).then(() => {})

    expect(result.current.user).toEqual(undefined)
    expect(result.current.token).toEqual('')
    expect(result.current.error).toEqual(Error('Login failed'))
  })

  it('logs out user', async () => {
    mockedLocalStorage.getItem = vi.fn(() => token)

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      ),
    })

    await new Promise(resolve => setTimeout(resolve, 0)).then(() => {})

    expect(result.current.token).toEqual(token)

    result.current.logout()

    await waitFor(() => {
      expect(result.current.user).toEqual(undefined)
      expect(result.current.token).toEqual('')
    })
  })
})
