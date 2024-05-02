import { useEffect, useRef, useState } from 'react'

function useDebounce<T>(value: T, delay: number, initialValue: T): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)
  const timerRef = useRef<NodeJS.Timeout | null>()

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    // Set a new timeout
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
