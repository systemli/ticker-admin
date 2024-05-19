import { ApiUrl, apiHeaders } from './Api'
import { Message, deleteMessageApi, fetchMessagesApi, postMessageApi } from './Message'

describe('fetchMessagesApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { messages: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchMessagesApi('token', 1)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages?limit=10`, { headers: apiHeaders('token') })
  })

  it('should return data with before parameter', async () => {
    const data = { status: 'success', data: { messages: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchMessagesApi('token', 1, 2)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages?limit=10&before=2`, { headers: apiHeaders('token') })
  })

  it('should return data with after parameter', async () => {
    const data = { status: 'success', data: { messages: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchMessagesApi('token', 1, undefined, 3)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages?limit=10&after=3`, { headers: apiHeaders('token') })
  })

  it('should return data with before and after parameters', async () => {
    const data = { status: 'success', data: { messages: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchMessagesApi('token', 1, 2, 3)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages?limit=10&before=2&after=3`, { headers: apiHeaders('token') })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchMessagesApi('token', 1)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages?limit=10`, { headers: apiHeaders('token') })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchMessagesApi('token', 1)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages?limit=10`, { headers: apiHeaders('token') })
  })

  it('should return data with custom limit', async () => {
    const data = { status: 'success', data: { messages: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchMessagesApi('token', 1, undefined, undefined, 5)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages?limit=5`, { headers: apiHeaders('token') })
  })
})

describe('postMessageApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { message: {} } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await postMessageApi('token', 'ticker', 'text', { type: 'FeatureCollection', features: [] }, [])
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/ticker/messages`, {
      headers: apiHeaders('token'),
      method: 'post',
      body: JSON.stringify({
        text: 'text',
        geoInformation: { type: 'FeatureCollection', features: [] },
        attachments: [],
      }),
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await postMessageApi('token', 'ticker', 'text', { type: 'FeatureCollection', features: [] }, [])
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/ticker/messages`, {
      headers: apiHeaders('token'),
      method: 'post',
      body: JSON.stringify({
        text: 'text',
        geoInformation: { type: 'FeatureCollection', features: [] },
        attachments: [],
      }),
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await postMessageApi('token', 'ticker', 'text', { type: 'FeatureCollection', features: [] }, [])
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/ticker/messages`, {
      headers: apiHeaders('token'),
      method: 'post',
      body: JSON.stringify({
        text: 'text',
        geoInformation: { type: 'FeatureCollection', features: [] },
        attachments: [],
      }),
    })
  })
})

describe('deleteMessageApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success' }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteMessageApi('token', { id: 1, ticker: 1 } as Message)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages/1`, {
      headers: apiHeaders('token'),
      method: 'delete',
    })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await deleteMessageApi('token', { id: 1, ticker: 1 } as Message)
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages/1`, {
      headers: apiHeaders('token'),
      method: 'delete',
    })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await deleteMessageApi('token', { id: 1, ticker: 1 } as Message)
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/tickers/1/messages/1`, {
      headers: apiHeaders('token'),
      method: 'delete',
    })
  })
})
