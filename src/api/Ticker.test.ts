import { ApiUrl, apiHeaders } from './Api'
import {
  Ticker,
  TickerBlueskyFormData,
  TickerFormData,
  TickerMastodonFormData,
  TickerTelegramFormData,
  deleteTickerApi,
  deleteTickerBlueskyApi,
  deleteTickerMastodonApi,
  deleteTickerTelegramApi,
  deleteTickerUserApi,
  fetchTickerApi,
  fetchTickerUsersApi,
  fetchTickersApi,
  postTickerApi,
  putTickerApi,
  putTickerBlueskyApi,
  putTickerMastodonApi,
  putTickerResetApi,
  putTickerTelegramApi,
  putTickerUsersApi,
} from './Ticker'
import { User } from './User'

describe('fetchTickersApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { tickers: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchTickersApi('token', { active: true })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers?active=true`, { headers: apiHeaders('token') })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchTickersApi('token', {})
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers?`, { headers: apiHeaders('token') })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchTickersApi('token', {})
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers?`, { headers: apiHeaders('token') })
  })
})

describe('fetchTickerApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchTickerApi('token', 1)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, { headers: apiHeaders('token') })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchTickerApi('token', 1)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, { headers: apiHeaders('token') })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchTickerApi('token', 1)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, { headers: apiHeaders('token') })
  })
})

describe('deleteTickerApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success' }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await deleteTickerApi('token', { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, { headers: apiHeaders('token'), method: 'delete' })
  })
})

describe('postTickerApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await postTickerApi('token', { title: 'title' } as TickerFormData)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers`, {
      headers: apiHeaders('token'),
      method: 'post',
      body: JSON.stringify({ title: 'title' }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await postTickerApi('token', { title: 'title' } as TickerFormData)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers`, {
      headers: apiHeaders('token'),
      method: 'post',
      body: JSON.stringify({ title: 'title' }),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await postTickerApi('token', { title: 'title' } as TickerFormData)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers`, {
      headers: apiHeaders('token'),
      method: 'post',
      body: JSON.stringify({ title: 'title' }),
    })
  })
})

describe('putTickerApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerApi('token', { title: 'title' } as TickerFormData, 1)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ title: 'title' }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerApi('token', { title: 'title' } as TickerFormData, 1)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ title: 'title' }),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putTickerApi('token', { title: 'title' } as TickerFormData, 1)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ title: 'title' }),
    })
  })
})

describe('fetchTickerUsersApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { users: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchTickerUsersApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users`, { headers: apiHeaders('token') })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchTickerUsersApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users`, { headers: apiHeaders('token') })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchTickerUsersApi('token', { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users`, { headers: apiHeaders('token') })
  })
})

describe('deleteTickerUserApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success' }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerUserApi('token', { id: 1 } as Ticker, { id: 1 } as User)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users/1`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerUserApi('token', { id: 1 } as Ticker, { id: 1 } as User)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users/1`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await deleteTickerUserApi('token', { id: 1 } as Ticker, { id: 1 } as User)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users/1`, { headers: apiHeaders('token'), method: 'delete' })
  })
})

describe('putTickerUsersApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { users: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerUsersApi('token', { id: 1 } as Ticker, [{ id: 1 } as User])
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ users: [{ id: 1 }] }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerUsersApi('token', { id: 1 } as Ticker, [{ id: 1 } as User])
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ users: [{ id: 1 }] }),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putTickerUsersApi('token', { id: 1 } as Ticker, [{ id: 1 } as User])
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/users`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ users: [{ id: 1 }] }),
    })
  })
})

describe('putTickerResetApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerResetApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/reset`, { headers: apiHeaders('token'), method: 'put' })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerResetApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/reset`, { headers: apiHeaders('token'), method: 'put' })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putTickerResetApi('token', { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/reset`, { headers: apiHeaders('token'), method: 'put' })
  })
})

describe('putTickerMastodonApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerMastodonApi('token', { active: true } as TickerMastodonFormData, { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/mastodon`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ active: true }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerMastodonApi('token', {} as TickerMastodonFormData, { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/mastodon`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({}),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putTickerMastodonApi('token', {} as TickerMastodonFormData, { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/mastodon`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({}),
    })
  })
})

describe('deleteTickerMastodonApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerMastodonApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/mastodon`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerMastodonApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/mastodon`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await deleteTickerMastodonApi('token', { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/mastodon`, { headers: apiHeaders('token'), method: 'delete' })
  })
})

describe('putTickerTelegramApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerTelegramApi('token', { active: true } as TickerTelegramFormData, { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/telegram`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ active: true }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerTelegramApi('token', {} as TickerTelegramFormData, { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/telegram`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({}),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putTickerTelegramApi('token', {} as TickerTelegramFormData, { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/telegram`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({}),
    })
  })
})

describe('deleteTickerTelegramApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerTelegramApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/telegram`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerTelegramApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/telegram`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await deleteTickerTelegramApi('token', { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/telegram`, { headers: apiHeaders('token'), method: 'delete' })
  })
})

describe('putTickerBlueskyApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerBlueskyApi('token', { active: true } as TickerBlueskyFormData, { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/bluesky`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({ active: true }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await putTickerBlueskyApi('token', {} as TickerBlueskyFormData, { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/bluesky`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({}),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await putTickerBlueskyApi('token', {} as TickerBlueskyFormData, { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/bluesky`, {
      headers: apiHeaders('token'),
      method: 'put',
      body: JSON.stringify({}),
    })
  })
})

describe('deleteTickerBlueskyApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { ticker: { id: 1 } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerBlueskyApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/bluesky`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteTickerBlueskyApi('token', { id: 1 } as Ticker)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/bluesky`, { headers: apiHeaders('token'), method: 'delete' })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await deleteTickerBlueskyApi('token', { id: 1 } as Ticker)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/bluesky`, { headers: apiHeaders('token'), method: 'delete' })
  })
})
