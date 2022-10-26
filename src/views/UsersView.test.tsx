import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../components/useAuth'
import UsersView from './UsersView'
import sign from 'jwt-encode'
import fetchMock from 'jest-fetch-mock'

describe('UsersView', function () {
  const jwt = sign(
    { id: 1, email: 'louis@systemli.org', roles: ['admin', 'user'] },
    'secret'
  )

  function setup() {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    return render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <AuthProvider>
            <UsersView />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  test('renders list', async function () {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(jwt)
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          users: [
            {
              id: 1,
              creation_date: new Date(),
              email: 'admin@systemli.org',
              is_super_admin: true,
            },
          ],
        },
      })
    )
    setup()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText('admin@systemli.org')).toBeInTheDocument()
  })
})
