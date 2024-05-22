import { renderHook } from '@testing-library/react-hooks'
import { ReactNode } from 'react'
import { NotificationProvider } from './NotificationContext'
import useNotification from './useNotification'

describe('useNotification', () => {
  it('throws error when not rendered within NotificationProvider', () => {
    const { result } = renderHook(() => useNotification())

    expect(result.error).toEqual(Error('useNotification must be used within a NotificationProvider'))
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
