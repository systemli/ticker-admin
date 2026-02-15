import { jwtDecode } from 'jwt-decode'
import { JSX, ReactNode, createContext, useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { login as loginApi } from '../api/Auth'

export type Roles = 'user' | 'admin'

export interface User {
  id: number
  email: string
  exp: number
  roles: Array<Roles>
}

export interface IAuthContext {
  user?: User
  token: string
  error?: Error
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

function loadAuthFromStorage(): { user: User | undefined; token: string; error: Error | undefined } {
  const storedToken = localStorage.getItem('token')

  if (!storedToken) {
    return { user: undefined, token: '', error: undefined }
  }

  let user: User
  try {
    user = jwtDecode(storedToken) as User
  } catch (error) {
    return { user: undefined, token: '', error: error as Error }
  }

  const now = Math.floor(new Date().getTime() / 1000)
  if (user.exp > now) {
    return { user, token: storedToken, error: undefined }
  }

  return { user: undefined, token: '', error: undefined }
}

interface AuthState {
  user: User | undefined
  token: string
  errorState: { error: Error; pathname: string } | undefined
  loading: boolean
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const [state, setState] = useState<AuthState>(() => {
    const init = loadAuthFromStorage()
    return {
      user: init.user,
      token: init.token,
      errorState: init.error ? { error: init.error, pathname: '' } : undefined,
      loading: false,
    }
  })
  const navigate = useNavigate()
  const location = useLocation()

  // Error is automatically cleared when the user navigates to a different page
  const error = state.errorState?.pathname === location.pathname ? state.errorState.error : undefined

  const login = useCallback(
    (email: string, password: string) => {
      setState(prev => ({ ...prev, loading: true }))

      loginApi(email, password)
        .then(response => {
          localStorage.setItem('token', response.token)
          const user = jwtDecode(response.token) as User
          setState(prev => ({ ...prev, user, token: response.token, loading: false }))
          navigate('/')
        })
        .catch((error: Error) => {
          setState(prev => ({
            ...prev,
            errorState: { error, pathname: location.pathname },
            loading: false,
          }))
        })
    },
    [navigate, location.pathname]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setState(prev => ({ ...prev, user: undefined, token: '' }))
    navigate('/login')
  }, [navigate])

  const memoedValue = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      loading: state.loading,
      error,
      login,
      logout,
    }),
    [state.user, state.token, state.loading, error, login, logout]
  )

  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
}

export default AuthContext
