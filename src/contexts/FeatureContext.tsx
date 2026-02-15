import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
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

  useEffect(() => {
    if (token === '') {
      return
    }

    let cancelled = false

    fetchFeaturesApi(token).then((result: ApiResponse<{ features: Features }>) => {
      if (cancelled) return

      if (result.error) {
        setState({ features: initialFeatures, loading: false, error: result.error.message })
      } else if (result.data) {
        setState({ features: result.data.features, loading: false, error: null })
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    return () => {
      cancelled = true
    }
  }, [token])

  const contextValue = useMemo(
    () => ({
      features: state.features,
      loading: state.loading,
      error: state.error,
    }),
    [state.features, state.loading, state.error]
  )

  return <FeatureContext.Provider value={contextValue}>{children}</FeatureContext.Provider>
}

export default FeatureContext
