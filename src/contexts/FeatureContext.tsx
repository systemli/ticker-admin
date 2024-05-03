import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import { Features, useFeatureApi } from '../api/Features'
import useAuth from './useAuth'

const FeatureContext = createContext<Features | undefined>(undefined)

const initalState: Features = {
  telegramEnabled: false,
}

export function FeatureProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const [features, setFeatures] = useState<Features>(initalState)
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true)
  const { token } = useAuth()
  const { getFeatures } = useFeatureApi(token)

  useEffect(() => {
    if (token === '') {
      setLoadingInitial(false)
      return
    }

    getFeatures()
      .then(response => {
        if (response.status === 'success') {
          setFeatures(response.data.features)
        }
      })
      .finally(() => {
        setLoadingInitial(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const memoedValue = useMemo(
    () => ({
      telegramEnabled: features.telegramEnabled,
    }),
    [features]
  )

  return <FeatureContext.Provider value={memoedValue}>{!loadingInitial && children}</FeatureContext.Provider>
}

export default FeatureContext
