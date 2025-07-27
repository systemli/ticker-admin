import { ApiResponse, ApiUrl, apiClient, apiHeaders } from './Api'

interface InactiveSettingsResponseData {
  setting: Setting<InactiveSetting>
}

export interface Setting<T> {
  id: number
  name: string
  value: T
}

export interface InactiveSetting {
  headline: string
  subHeadline: string
  description: string
  author: string
  email: string
  homepage: string
  twitter: string
}

export async function fetchInactiveSettingsApi(token: string): Promise<ApiResponse<InactiveSettingsResponseData>> {
  return apiClient<InactiveSettingsResponseData>(`${ApiUrl}/admin/settings/inactive_settings`, { headers: apiHeaders(token) })
}

export async function putInactiveSettingsApi(token: string, data: InactiveSetting): Promise<ApiResponse<InactiveSettingsResponseData>> {
  return apiClient<InactiveSettingsResponseData>(`${ApiUrl}/admin/settings/inactive_settings`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}
