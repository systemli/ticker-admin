import { ApiUrl, Response } from './Api'
import AuthSingleton from '../components/AuthService'

const Auth = AuthSingleton.getInstance()

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

export function getInactiveSettings(): Promise<
  Response<InactiveSettingsResponseData>
> {
  return Auth.fetch(`${ApiUrl}/admin/settings/inactive_settings`)
}

export function getRefreshInterval(): Promise<
  Response<RefreshIntervalResponseData>
> {
  return Auth.fetch(`${ApiUrl}/admin/settings/refresh_interval`)
}

export function putInactiveSettings(data: InactiveSetting) {
  return Auth.fetch(`${ApiUrl}/admin/settings/inactive_settings`, {
    body: JSON.stringify(data),
    method: 'PUT',
  })
}

export function putRefreshInterval(
  refreshInterval: number
): Promise<Response<RefreshIntervalResponseData>> {
  return Auth.fetch(`${ApiUrl}/admin/settings/refresh_interval`, {
    body: JSON.stringify({ refresh_interval: refreshInterval }),
    method: 'PUT',
  })
}
