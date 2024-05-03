import { useContext } from 'react'
import FeatureContext from './FeatureContext'

const useFeature = () => {
  const context = useContext(FeatureContext)
  if (!context) {
    throw new Error('useFeature must be used within a FeatureProvider')
  }
  return context
}

export default useFeature
