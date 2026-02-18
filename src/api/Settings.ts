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

interface TelegramSettingsResponseData {
  setting: Setting<TelegramSetting>
}

export interface TelegramSetting {
  token: string
  botUsername: string
}

export interface TelegramSettingFormData {
  token: string
}

export async function fetchTelegramSettingsApi(token: string): Promise<ApiResponse<TelegramSettingsResponseData>> {
  return apiClient<TelegramSettingsResponseData>(`${ApiUrl}/admin/settings/telegram_settings`, { headers: apiHeaders(token) })
}

export async function putTelegramSettingsApi(token: string, data: TelegramSettingFormData): Promise<ApiResponse<TelegramSettingsResponseData>> {
  return apiClient<TelegramSettingsResponseData>(`${ApiUrl}/admin/settings/telegram_settings`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}

interface SignalGroupSettingsResponseData {
  setting: Setting<SignalGroupSetting>
}

export interface SignalGroupSetting {
  apiUrl: string
  account: string
  avatar: string
}

export interface SignalGroupSettingFormData {
  apiUrl: string
  account: string
  avatar: string
}

export async function fetchSignalGroupSettingsApi(token: string): Promise<ApiResponse<SignalGroupSettingsResponseData>> {
  return apiClient<SignalGroupSettingsResponseData>(`${ApiUrl}/admin/settings/signal_group_settings`, { headers: apiHeaders(token) })
}

export async function putSignalGroupSettingsApi(token: string, data: SignalGroupSettingFormData): Promise<ApiResponse<SignalGroupSettingsResponseData>> {
  return apiClient<SignalGroupSettingsResponseData>(`${ApiUrl}/admin/settings/signal_group_settings`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}
