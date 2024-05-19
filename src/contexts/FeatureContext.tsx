import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { ApiResponse } from '../api/Api'
import { Features, fetchFeaturesApi } from '../api/Features'
import useAuth from './useAuth'

interface FeatureContextType {
  features: Features
  loading: boolean
  error: string | null
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined)

const initalState: Features = {
  telegramEnabled: false,
}

export function FeatureProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const [features, setFeatures] = useState<Features>(initalState)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const fetchFeatures = useCallback(async () => {
    if (token === '') {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const result: ApiResponse<{ features: Features }> = await fetchFeaturesApi(token)

    if (result.error) {
      setError(result.error.message)
    } else if (result.data) {
      setFeatures(result.data.features)
    }

    setLoading(false)
  }, [token])

  useEffect(() => {
    fetchFeatures()
  }, [fetchFeatures])

  const contextValue = useMemo(
    () => ({
      features,
      loading,
      error,
    }),
    [features, loading, error]
  )

  return <FeatureContext.Provider value={contextValue}>{children}</FeatureContext.Provider>
}

export default FeatureContext
