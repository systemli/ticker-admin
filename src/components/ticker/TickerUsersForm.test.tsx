import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import { renderWithProviders, setMockToken, userToken } from '../../tests/utils'
import TickerUsersForm from './TickerUsersForm'

describe('TickerUsersForm', () => {
  beforeEach(() => {
    setMockToken(userToken)
    fetchMock.resetMocks()
    handleSubmit.mockClear()
  })

  const handleSubmit = vi.fn()

  const component = ({ ticker, defaultValue }: { ticker: Ticker; defaultValue: Array<User> }) => {
    return (
      <>
        <TickerUsersForm defaultValue={defaultValue} onSubmit={handleSubmit} ticker={ticker} />
        <input name="Submit" type="submit" value="Submit" form="tickerUsersForm" />
      </>
    )
  }

  const ticker = {
    id: 1,
    title: 'Ticker 1',
  } as Ticker
  const user = {
    id: 1,
    email: 'user@systemli.org',
  } as User

  it('should renders correctly', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          users: [user],
        },
        status: 'success',
      })
    )

    renderWithProviders(component({ ticker, defaultValue: [user] }))

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toBeInTheDocument()
    expect(screen.getAllByText('user@systemli.org')).toHaveLength(2)

    await userEvent.click(screen.getAllByText('user@systemli.org')[1])

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
      })
    )

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/v1/admin/tickers/1/users', {
      body: JSON.stringify({ users: [] }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      method: 'put',
    })
  })

  it('should fail when response fails', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          users: [user],
        },
        status: 'success',
      })
    )

    renderWithProviders(component({ ticker, defaultValue: [] }))

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toBeInTheDocument()
    expect(screen.getAllByText('user@systemli.org')).toHaveLength(1)

    await userEvent.click(screen.getAllByText('user@systemli.org')[0])

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'error',
      })
    )

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('should fail when request fails', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          users: [user],
        },
        status: 'success',
      })
    )

    renderWithProviders(component({ ticker, defaultValue: [] }))

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toBeInTheDocument()
    expect(screen.getAllByText('user@systemli.org')).toHaveLength(1)

    await userEvent.click(screen.getAllByText('user@systemli.org')[0])

    fetchMock.mockReject()

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
