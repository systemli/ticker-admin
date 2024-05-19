import { ApiUrl, apiHeaders } from './Api'
import { postUploadApi } from './Upload'

describe('postUploadApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { uploads: [] } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await postUploadApi('token', new FormData())
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/upload`, { headers: apiHeaders('token'), method: 'post', body: new FormData() })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await postUploadApi('token', new FormData())
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/upload`, { headers: apiHeaders('token'), method: 'post', body: new FormData() })
  })

  it('should throw error on network failure', async () => {
    fetchMock.mockReject(new Error('Failed to fetch'))
    const response = await postUploadApi('token', new FormData())
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Failed to fetch' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/upload`, { headers: apiHeaders('token'), method: 'post', body: new FormData() })
  })
})
