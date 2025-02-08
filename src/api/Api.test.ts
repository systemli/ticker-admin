import { apiClient, apiHeaders, ApiResponse, handleApiCall } from './Api'

describe('apiClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should return data on success', async () => {
    const data = { status: 'success', data: { features: { telegramEnabled: true } } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await apiClient('/admin/features', { headers: apiHeaders('token') })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/admin/features', { headers: apiHeaders('token') })
  })

  it('should throw error on non-200 status', async () => {
    const data = { status: 'error', error: { code: 500, message: 'Internal Server Error' } }
    fetchMock.mockResponseOnce(JSON.stringify(data))
    const response = await apiClient('/admin/features', { headers: apiHeaders('token') })
    expect(response).toEqual(data)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/admin/features', { headers: apiHeaders('token') })
  })

  it('should throw error on network error', async () => {
    fetchMock.mockReject(new Error('Network error'))
    const response = await apiClient('/admin/features', { headers: apiHeaders('token') })
    expect(response).toEqual({ status: 'error', error: { code: 500, message: 'Network error' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/admin/features', { headers: apiHeaders('token') })
  })
})

describe('handleApiCall', async () => {
  const onSuccess = vi.fn()
  const onError = vi.fn()
  const onFailure = vi.fn()

  beforeEach(() => {
    onSuccess.mockClear()
    onError.mockClear()
    onFailure.mockClear()
  })

  it('should call onSuccess on success', async () => {
    const apiCall = Promise.resolve({ status: 'success' } as ApiResponse<unknown>)
    await handleApiCall(apiCall, { onSuccess, onError, onFailure })
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
    expect(onFailure).not.toHaveBeenCalled()
  })

  it('should call onError on error', async () => {
    const apiCall = Promise.resolve({ status: 'error' } as ApiResponse<unknown>)
    await handleApiCall(apiCall, { onSuccess, onError, onFailure })
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onFailure).not.toHaveBeenCalled()
  })

  it('should call onFailure on failure', async () => {
    const apiCall = Promise.reject(new Error('Network error'))
    await handleApiCall(apiCall, { onSuccess, onError, onFailure })
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onFailure).toHaveBeenCalledTimes(1)
  })
})
