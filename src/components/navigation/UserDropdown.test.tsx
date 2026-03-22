import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import UserDropdown from './UserDropdown'

describe('UserDropdown', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
  })

  it('should render with aria-label', () => {
    renderWithProviders(<UserDropdown />)

    expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument()
  })

  it('should open the menu on click', async () => {
    renderWithProviders(<UserDropdown />)

    await userEvent.click(screen.getByRole('button', { name: 'Account' }))

    expect(screen.getByText('user@example.org')).toBeInTheDocument()
    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should logout on click', async () => {
    renderWithProviders(<UserDropdown />)

    await userEvent.click(screen.getByRole('button', { name: 'Account' }))
    await userEvent.click(screen.getByText('Logout'))

    expect(localStorage.removeItem).toHaveBeenCalled()
  })
})
