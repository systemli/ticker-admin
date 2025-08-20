import { renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from './AuthContext'
import { FeatureProvider } from './FeatureContext'
import useFeature from './useFeature'

describe('useFeature', () => {
  it('throws error when not rendered within FeatureProvider', () => {
    // Suppress expected error output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useFeature())
    }).toThrow('useFeature must be used within a FeatureProvider')

    // Restore console.error
    consoleSpy.mockRestore()
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

    // Wait for providers to initialize
    await waitFor(() => {
      expect(result.current).toEqual({ error: null, features: { telegramEnabled: false }, loading: false })
    })
  })
})
