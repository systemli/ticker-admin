import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { login as loginApi } from '../api/Auth'
import { useLocation, useNavigate } from 'react-router'
import decode from 'jwt-decode'

export type Roles = 'user' | 'admin'

interface User {
  id: number
  email: string
  exp: number
  roles: Array<Roles>
}

interface IAuthContext {
  user?: User
  token?: string
  error?: Error
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [user, setUser] = useState<User>()
  const [token, setToken] = useState<string>()
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

    if (token === null) {
      setLoadingInitial(false)
      return
    }

    const user = decode(token) as User
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

          const user = decode(response.token) as User
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
    setToken(undefined)
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

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
