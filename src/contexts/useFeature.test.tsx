import { renderHook } from '@testing-library/react'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from './AuthContext'
import { FeatureProvider } from './FeatureContext'
import useFeature from './useFeature'

describe('useFeature', () => {
  it('throws error when not rendered within FeatureProvider', () => {
    expect(() => {
      renderHook(() => useFeature())
    }).toThrow('useFeature must be used within a FeatureProvider')
  })

  it('returns context when rendered within FeatureProvider', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter>
        <AuthProvider>
          <FeatureProvider>{children}</FeatureProvider>
        </AuthProvider>
      </MemoryRouter>
    )
    const { result } = renderHook(() => useFeature(), { wrapper })

    expect(result.current).toEqual({ error: null, features: { telegramEnabled: false }, loading: false })
  })
})
