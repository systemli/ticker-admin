import { render, screen } from '@testing-library/react'
import sign from 'jwt-encode'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthContext'

// Mock of useNavigate, useLocation (react-router)
vi.mock('react-router', () => ({
  ...vi.importActual('react-router'), // This ensures any other exports remain intact
  useNavigate: vi.fn(() => vi.fn()), // A function that returns another function
  useLocation: vi.fn(() => ({ pathname: '/somepath' })),
}))

// Setup and teardown for localStorage
const mockedLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
global.localStorage = mockedLocalStorage

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AuthProvider', () => {
  it('loads and decodes token from localStorage on initial render', async () => {
    const token = sign({ id: 1, email: 'user@example.com', roles: ['user'] as Array<'user' | 'admin'>, exp: Math.floor(Date.now() / 1000) + 5000 }, 'secret')

    mockedLocalStorage.getItem = vi.fn(() => token)

    render(
      <MemoryRouter>
        <AuthProvider>
          <div>Child component</div>
        </AuthProvider>
      </MemoryRouter>
    )

    await screen.findByText('Child component')
    expect(mockedLocalStorage.getItem).toHaveBeenCalledWith('token')
  })
})
