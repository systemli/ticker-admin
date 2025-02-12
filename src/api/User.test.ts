import { apiHeaders, ApiUrl } from './Api'
import { deleteUserApi, fetchUsersApi, putMeApi, putUserApi, User } from './User'

describe('fetchUsersApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { users: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchUsersApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users`, { headers: apiHeaders('token') })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchUsersApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users`, { headers: apiHeaders('token') })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchUsersApi('token')
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users`, { headers: apiHeaders('token') })
  })
})

describe('putUserApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const user = { id: 1, createdAt: '', email: 'user@example.com', role: 'user', isSuperAdmin: false } as User

  it('should return data on success', async () => {
    const data = { status: 'success', data: { user: user } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    await putUserApi('token', user, { email: 'user@example.com', isSuperAdmin: false })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ email: 'user@example.com', isSuperAdmin: false }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putUserApi('token', user, { email: 'user@example.com', isSuperAdmin: false })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ email: 'user@example.com', isSuperAdmin: false }),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putUserApi('token', user, { email: 'user@example.com', isSuperAdmin: false })
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ email: 'user@example.com', isSuperAdmin: false }),
    })
  })
})

describe('postUserApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const user = { id: 1, createdAt: '', email: 'user@example.com', role: 'user', isSuperAdmin: false } as User

  it('should return data on success', async () => {
    const data = { status: 'success', data: { user: user } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    putUserApi('token', user, { email: 'user@example.com', isSuperAdmin: false })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ email: 'user@example.com', isSuperAdmin: false }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putUserApi('token', user, { email: 'user@example.com', isSuperAdmin: false })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ email: 'user@example.com', isSuperAdmin: false }),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putUserApi('token', user, { email: 'user@example.com', isSuperAdmin: false })
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ email: 'user@example.com', isSuperAdmin: false }),
    })
  })
})

describe('deleteUserApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const user = { id: 1, createdAt: '', email: 'user@example.com', role: 'user', isSuperAdmin: false } as User

  it('should return data on success', async () => {
    const data = { status: 'success' }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    await deleteUserApi('token', user)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'delete',
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteUserApi('token', user)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'delete',
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await deleteUserApi('token', user)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/1`, {
      headers: apiHeaders('token'),
      method: 'delete',
    })
  })
})

describe('putMeApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { user: { id: 1, createdAt: '', email: 'user@example.com', role: 'user', isSuperAdmin: false } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    await putMeApi('token', { password: 'password', newPassword: 'newpassword' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/me`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ password: 'password', newPassword: 'newpassword' }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putMeApi('token', { password: 'password', newPassword: 'newpassword' })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/me`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ password: 'password', newPassword: 'newpassword' }),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putMeApi('token', { password: 'password', newPassword: 'newpassword' })
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/users/me`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ password: 'password', newPassword: 'newpassword' }),
    })
  })
})
