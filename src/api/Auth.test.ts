import { login } from './Auth'

describe('Auth', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should fail to login when credentials wrong', () => {
    fetchMock.mockResponse(
      JSON.stringify({
        data: {},
        status: 'error',
        error: { code: 1002, message: 'not found' },
      }),
      { status: 401 }
    )

    expect(login('user@systemli.org', 'password')).rejects.toThrow('Login failed')
  })

  it('should fail when network fails', () => {
    fetchMock.mockReject()

    expect(login('user@systemli.org', 'password')).rejects.toThrow('Login failed')
  })

  it('should succeed', () => {
    const response = {
      code: 200,
      expire: '2022-10-01T18:22:37+02:00',
      token: 'token',
    }
    fetchMock.mockResponse(JSON.stringify(response), { status: 200 })

    expect(login('user@systemli.org', 'password')).resolves.toEqual(response)
  })
})
