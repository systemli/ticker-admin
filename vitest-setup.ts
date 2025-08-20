import '@testing-library/jest-dom'
import { vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

const fetchMocker = createFetchMock(vi)

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks()

// Mock localStorage globally to prevent act() warnings
const mockLocalStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

// Assign to both global and window for broader compatibility
global.localStorage = mockLocalStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

// Reset localStorage mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  mockLocalStorage.getItem = vi.fn(() => null)
})

// Helper function to set localStorage token for tests
globalThis.setMockToken = (token: string | null) => {
  vi.mocked(localStorage.getItem).mockReturnValue(token)
}
