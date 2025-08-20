import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { User } from '../../api/User'
import { adminToken, renderWithProviders, setMockToken } from '../../tests/utils'
import UserForm from './UserForm'

describe('UserForm', () => {
  beforeEach(() => {
    setMockToken(adminToken)
    fetchMock.resetMocks()
    callback.mockClear()
    setSubmitting.mockClear()
  })

  const callback = vi.fn()
  const setSubmitting = vi.fn()

  const component = (user?: User) => {
    return (
      <>
        <UserForm user={user} id="userForm" callback={callback} setSubmitting={setSubmitting} />
        <input name="Submit" type="submit" value="Submit" form="userForm" />
      </>
    )
  }

  it('should render the component', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          tickers: [],
        },
        status: 'success',
      })
    )

    renderWithProviders(component())

    expect(screen.getByLabelText('E-Mail *')).toBeInTheDocument()
    expect(screen.getByLabelText('Password *')).toBeInTheDocument()
    expect(screen.getByLabelText('Repeat Password *')).toBeInTheDocument()
    expect(screen.getByLabelText('Super Admin')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('E-Mail *'), 'user@example.org')
    await userEvent.type(screen.getByLabelText('Password *'), 'password')
    await userEvent.type(screen.getByLabelText('Repeat Password *'), 'password')
    await userEvent.click(screen.getByLabelText('Super Admin'))

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toBeCalledTimes(1)
    expect(setSubmitting).toBeCalledTimes(2)
    expect(fetchMock).toBeCalledTimes(2)

    expect(fetchMock).toBeCalledWith('http://localhost:8080/v1/admin/users', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + adminToken,
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({
        email: 'user@example.org',
        isSuperAdmin: true,
        password: 'password',
      }),
    })
  })

  it('should render the component for existing user', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          tickers: [],
        },
        status: 'success',
      })
    )

    renderWithProviders(
      component({
        id: 1,
        email: 'user@example.org',
        isSuperAdmin: true,
      } as User)
    )

    expect(screen.getByLabelText('E-Mail *')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Repeat Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Super Admin')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Super Admin'))
    await userEvent.type(screen.getByLabelText('Password'), 'password')
    await userEvent.type(screen.getByLabelText('Repeat Password'), 'password')

    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }))

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(callback).toBeCalledTimes(1)
    expect(setSubmitting).toBeCalledTimes(2)
    expect(fetchMock).toBeCalledTimes(2)
    expect(fetchMock).toBeCalledWith('http://localhost:8080/v1/admin/users/1', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + adminToken,
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify({
        email: 'user@example.org',
        isSuperAdmin: false,
        password: 'password',
      }),
    })
  })
})
