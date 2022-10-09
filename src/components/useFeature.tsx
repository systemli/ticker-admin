import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Features, useFeatureApi } from '../api/Features'
import useAuth from './useAuth'

const FeatureContext = createContext<Features>({} as Features)

const initalState: Features = {
  twitter_enabled: false,
  telegram_enabled: false,
}

export function FeatureProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
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
      twitter_enabled: features.twitter_enabled,
      telegram_enabled: features.telegram_enabled,
    }),
    [features]
  )

  return (
    <FeatureContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </FeatureContext.Provider>
  )
}

export default function useFeature() {
  return useContext(FeatureContext)
}
