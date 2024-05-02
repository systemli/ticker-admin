import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import useDebounce from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('updates the debounced value after the specified delay', async () => {
    const { result, rerender } = renderHook(
      // The hook is called with a starting value and delay
      ({ value, delay }) => useDebounce(value, delay, value),
      {
        initialProps: {
          value: 'initial',
          delay: 500,
        },
      }
    )

    // Assert initial state
    expect(result.current).toBe('initial')

    // Change the value and advance timers just below the delay threshold
    rerender({ value: 'updated', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(499)
    })

    // Value should not have changed yet
    expect(result.current).toBe('initial')

    // Complete the delay period
    act(() => {
      vi.advanceTimersByTime(1)
    })

    // Now the value should be updated
    expect(result.current).toBe('updated')
  })
})
