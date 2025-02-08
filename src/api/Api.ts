export const ApiUrl = import.meta.env.TICKER_API_URL

type StatusSuccess = 'success'
type StatusError = 'error'
type Status = StatusSuccess | StatusError

export interface ApiResponse<T> {
  data?: T
  status: Status
  error?: {
    code: number
    message: string
  }
}

export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const message = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${message}`)
    }

    const data: ApiResponse<T> = await response.json()

    if (data.status === 'error') {
      throw new Error(data.error?.message || 'Unknown error')
    }

    return data
  } catch (error) {
    return {
      status: 'error',
      error: {
        code: 500,
        message: (error as Error).message || 'Unknown error',
      },
    }
  }
}

export function apiHeaders(token: string): HeadersInit {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

interface ApiCallParams<T> {
  onSuccess: (response: ApiResponse<T>) => void
  onError: (response: ApiResponse<T>) => void
  onFailure: (error: unknown) => void
}

export async function handleApiCall<T>(apiCall: Promise<ApiResponse<T>>, params: ApiCallParams<T>): Promise<void> {
  const { onSuccess, onError, onFailure } = params

  try {
    const response = await apiCall
    if (response.status === 'error') {
      onError(response)
    } else {
      onSuccess(response)
    }
  } catch (error) {
    onFailure(error)
  }
}
