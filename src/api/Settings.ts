import { ApiResponse, ApiUrl, apiClient, apiHeaders } from './Api'

interface InactiveSettingsResponseData {
  setting: Setting<InactiveSetting>
}

interface RefreshIntervalResponseData {
  setting: Setting<RefreshIntervalSetting>
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

export interface RefreshIntervalSetting {
  refreshInterval: string
}

export interface RefreshInterval {
  id: number
  name: string
  value: string
}

export async function fetchInactiveSettingsApi(token: string): Promise<ApiResponse<InactiveSettingsResponseData>> {
  return apiClient<InactiveSettingsResponseData>(`${ApiUrl}/admin/settings/inactive_settings`, { headers: apiHeaders(token) })
}

export async function fetchRefreshIntervalApi(token: string): Promise<ApiResponse<RefreshIntervalResponseData>> {
  return apiClient<RefreshIntervalResponseData>(`${ApiUrl}/admin/settings/refresh_interval`, { headers: apiHeaders(token) })
}

export async function putRefreshIntervalApi(token: string, refreshInterval: number): Promise<ApiResponse<RefreshIntervalResponseData>> {
  return apiClient<RefreshIntervalResponseData>(`${ApiUrl}/admin/settings/refresh_interval`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify({ refreshInterval: refreshInterval }),
  })
}

export async function putInactiveSettingsApi(token: string, data: InactiveSetting): Promise<ApiResponse<InactiveSettingsResponseData>> {
  return apiClient<InactiveSettingsResponseData>(`${ApiUrl}/admin/settings/inactive_settings`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}
