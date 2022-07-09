import { ApiUrl, Response } from './Api'

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
  sub_headline: string
  description: string
  author: string
  email: string
  homepage: string
  twitter: string
}

interface RefreshIntervalResponseData {
  setting: Setting<string>
}

export interface RefreshInterval {
  id: number
  name: string
  value: string
}

export function useSettingsApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const getInactiveSettings = (): Promise<
    Response<InactiveSettingsResponseData>
  > => {
    return fetch(`${ApiUrl}/admin/settings/inactive_settings`, {
      headers: headers,
    }).then(response => response.json())
  }

  const getRefreshInterval = (): Promise<
    Response<RefreshIntervalResponseData>
  > => {
    return fetch(`${ApiUrl}/admin/settings/refresh_interval`, {
      headers: headers,
    }).then(response => response.json())
  }

  const putRefreshInterval = (
    refreshInterval: number
  ): Promise<Response<RefreshIntervalResponseData>> => {
    return fetch(`${ApiUrl}/admin/settings/refresh_interval`, {
      headers: headers,
      body: JSON.stringify({ refresh_interval: refreshInterval }),
      method: 'put',
    }).then(response => response.json())
  }

  const putInactiveSettings = (
    data: InactiveSetting
  ): Promise<Response<InactiveSettingsResponseData>> => {
    return fetch(`${ApiUrl}/admin/settings/inactive_settings`, {
      headers: headers,
      body: JSON.stringify(data),
      method: 'put',
    }).then(response => response.json())
  }

  return {
    getInactiveSettings,
    getRefreshInterval,
    putInactiveSettings,
    putRefreshInterval,
  }
}
