import { Table, TableBody } from '@mui/material'
import { screen } from '@testing-library/react'
import { User } from '../../api/User'
import { adminToken, renderWithProviders, setMockToken } from '../../tests/utils'
import UserListItem from './UserListItem'

describe('UserListItem', () => {
  beforeEach(() => {
    setMockToken(adminToken)
    fetchMock.resetMocks()
  })

  const component = (user: User) => {
    return (
      <Table>
        <TableBody>
          <UserListItem user={user} />
        </TableBody>
      </Table>
    )
  }

  it('should render a super admin user', () => {
    const user = {
      id: 1,
      createdAt: '2021-01-01T00:00:00Z',
      lastLogin: '2021-06-01T00:00:00Z',
      email: 'admin@example.org',
      role: 'admin',
      isSuperAdmin: true,
    } as User

    renderWithProviders(component(user))

    expect(screen.getByText('admin@example.org')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
  })

  it('should render a non-super-admin user', () => {
    const user = {
      id: 2,
      createdAt: '2021-01-01T00:00:00Z',
      lastLogin: '0001-01-01T00:00:00Z',
      email: 'user@example.org',
      role: 'user',
      isSuperAdmin: false,
    } as User

    renderWithProviders(component(user))

    expect(screen.getByText('user@example.org')).toBeInTheDocument()
    expect(screen.getByText('never')).toBeInTheDocument()
  })
})
