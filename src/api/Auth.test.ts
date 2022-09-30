import { login } from './Auth'

describe('Auth', function () {
  beforeEach(() => {
    fetchMock.resetMocks()
    fetchMock.doMock()
  })

  test('login failed', function () {
    fetchMock.mockResponse(
      JSON.stringify({
        data: {},
        status: 'error',
        error: { code: 1002, message: 'not found' },
      }),
      { status: 401 }
    )

    expect(login('user@systemli.org', 'password')).rejects.toThrow(
      'Login failed'
    )
  })

  test('server error', function () {
    fetchMock.mockReject()

    expect(login('user@systemli.org', 'password')).rejects.toThrow(
      'Login failed'
    )
  })

  test('login successful', function () {
    const response = {
      code: 200,
      expire: '2022-10-01T18:22:37+02:00',
      token: 'token',
    }
    fetchMock.mockResponse(JSON.stringify(response), { status: 200 })

    expect(login('user@systemli.org', 'password')).resolves.toEqual(response)
  })
})
