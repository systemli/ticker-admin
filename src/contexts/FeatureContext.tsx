import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { ApiResponse } from '../api/Api'
import { Features, fetchFeaturesApi } from '../api/Features'
import useAuth from './useAuth'

interface FeatureState {
  features: Features
  loading: boolean
  error: string | null
}

interface FeatureContextType {
  features: Features
  loading: boolean
  error: string | null
  refreshFeatures: () => void
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined)

const initialFeatures: Features = {
  telegramEnabled: false,
}

export function FeatureProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const { token } = useAuth()
  const [state, setState] = useState<FeatureState>({
    features: initialFeatures,
    loading: token !== '',
    error: null,
  })

  const fetchFeatures = useCallback(
    (authToken: string) => {
      if (authToken === '') {
        return
      }

      fetchFeaturesApi(authToken).then((result: ApiResponse<{ features: Features }>) => {
        if (result.status === 'error') {
          setState({ features: initialFeatures, loading: false, error: result.error?.message ?? 'Unknown error' })
        } else if (result.data) {
          setState({ features: result.data.features, loading: false, error: null })
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      })
    },
    [setState]
  )

  useEffect(() => {
    if (token === '') {
      return
    }

    fetchFeatures(token)
  }, [token, fetchFeatures])

  const refreshFeatures = useCallback(() => {
    fetchFeatures(token)
  }, [token, fetchFeatures])

  const contextValue = useMemo(
    () => ({
      features: state.features,
      loading: state.loading,
      error: state.error,
      refreshFeatures,
    }),
    [state.features, state.loading, state.error, refreshFeatures]
  )

  return <FeatureContext.Provider value={contextValue}>{children}</FeatureContext.Provider>
}

export default FeatureContext
