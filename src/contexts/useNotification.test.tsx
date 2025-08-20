import { renderHook } from '@testing-library/react'
import { ReactNode } from 'react'
import { NotificationProvider } from './NotificationContext'
import useNotification from './useNotification'

describe('useNotification', () => {
  it('throws error when not rendered within NotificationProvider', () => {
    // Suppress expected error output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useNotification())
    }).toThrow('useNotification must be used within a NotificationProvider')

    // Restore console.error
    consoleSpy.mockRestore()
  })

  it('returns context when rendered within NotificationProvider', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <NotificationProvider>{children}</NotificationProvider>
    const { result } = renderHook(() => useNotification(), { wrapper })

    expect(result.current).toEqual({
      isOpen: false,
      notification: undefined,
      closeNotification: expect.any(Function),
      createNotification: expect.any(Function),
    })
  })
})
