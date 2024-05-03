import { ReactNode, createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { jwtDecode } from 'jwt-decode'
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

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const [user, setUser] = useState<User>()
  const [token, setToken] = useState<string>('')
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setError(undefined)
  }, [location.pathname])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoadingInitial(false)
      return
    }

    let user: User
    try {
      user = jwtDecode(token) as User
    } catch (error) {
      setError(error as Error)
      setLoadingInitial(false)
      return
    }
    const now = Math.floor(new Date().getTime() / 1000)

    if (user.exp > now) {
      setUser(user)
      setToken(token)
    }

    setLoadingInitial(false)
  }, [])

  const login = useCallback(
    (email: string, password: string) => {
      setLoading(true)

      loginApi(email, password)
        .then(response => {
          localStorage.setItem('token', response.token)
          setToken(response.token)

          const user = jwtDecode(response.token) as User
          setUser(user)
          navigate('/')
        })
        .catch((error: Error) => setError(error))
        .finally(() => setLoading(false))
    },
    [navigate]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(undefined)
    setToken('')
    navigate('/login')
  }, [navigate])

  const memoedValue = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      logout,
    }),
    [user, token, loading, error, login, logout]
  )

  return <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
}

export default AuthContext
