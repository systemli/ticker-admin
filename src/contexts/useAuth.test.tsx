import { act, renderHook, waitFor } from '@testing-library/react'
import sign from 'jwt-encode'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { AuthProvider, Roles } from './AuthContext'
import useAuth from './useAuth'

const exp = Math.floor(Date.now() / 1000) + 5000
const token = sign({ id: 1, email: 'user@example.org', roles: ['user'] as Array<Roles>, exp: exp }, 'secret')

// Test wrapper component with proper routing context
const createWrapper = () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
  return Wrapper
}

beforeEach(() => {
  fetchMock.resetMocks()
  vi.clearAllMocks()
})

describe('useAuth', () => {
  it('throws error when not rendered within AuthProvider', () => {
    // Suppress expected error output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within a AuthProvider')

    // Restore console.error
    consoleSpy.mockRestore()
  })

  it('returns initial values', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.user).toEqual(undefined)
      expect(result.current.token).toEqual('')
    })
  })

  it('returns user and token when stored in localStorage', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(token)

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    // Wait for the useEffect to process the localStorage token
    await waitFor(() => {
      expect(result.current.user).toEqual({ id: 1, email: 'user@example.org', roles: ['user'], exp: exp })
      expect(result.current.token).toEqual(token)
    })

    expect(result.current.error).toEqual(undefined)
  })

  it('returns user and token after login', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    fetchMock.mockResponseOnce(JSON.stringify({ code: 200, token: token, expire: exp }))

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.user).toBeUndefined()
    })

    // Perform login wrapped in act
    await act(async () => {
      result.current.login('user@example.org', 'password')
    })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/login', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({ username: 'user@example.org', password: 'password' }),
    })

    // Wait for login to complete and state to update
    await waitFor(() => {
      expect(result.current.user).toEqual({ id: 1, email: 'user@example.org', roles: ['user'], exp: exp })
      expect(result.current.token).toEqual(token)
      expect(result.current.error).toEqual(undefined)
    })
  })

  it('returns error after failed login', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    fetchMock.mockRejectOnce(new Error('Login failed'))

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.user).toBeUndefined()
    })

    // Perform failed login wrapped in act
    await act(async () => {
      result.current.login('user@example.org', 'password')
    })

    // Wait for error state to be set
    await waitFor(() => {
      expect(result.current.user).toEqual(undefined)
      expect(result.current.token).toEqual('')
      expect(result.current.error).toEqual(Error('Login failed'))
    })
  })

  it('logs out user', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(token)

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    // Wait for the useEffect to process the localStorage token
    await waitFor(() => {
      expect(result.current.token).toEqual(token)
    })

    // Perform logout wrapped in act
    await act(async () => {
      result.current.logout()
    })

    // Wait for logout to complete and state to update
    await waitFor(() => {
      expect(result.current.user).toEqual(undefined)
      expect(result.current.token).toEqual('')
    })
  })
})
