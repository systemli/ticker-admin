import { ApiUrl, apiHeaders } from './Api'
import { fetchFeaturesApi } from './Features'

describe('fetchFeaturesApi', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { features: { telegramEnabled: true } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchFeaturesApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/features`, { headers: apiHeaders('token') })
  })

  it('should return data on error', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await fetchFeaturesApi('token')
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/features`, { headers: apiHeaders('token') })
  })

  it('should return data on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await fetchFeaturesApi('token')
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/admin/features`, { headers: apiHeaders('token') })
  })
})
