import { SortDirection } from '@mui/material'
import { ApiResponse, ApiUrl, apiClient, apiHeaders } from './Api'
import { User } from './User'

interface TickersResponseData {
  tickers: Array<Ticker>
}

interface TickerResponseData {
  ticker: Ticker
}

interface TickerUsersResponseData {
  users: Array<User>
}

export interface TickerFormData {
  domain: string
  title: string
  description: string
  active: boolean
  information: TickerInformation
  mastodon: TickerMastodon
  telegram: TickerTelegram
  bluesky: TickerBluesky
  location: TickerLocation
}

export interface Ticker {
  id: number
  createdAt: Date
  domain: string
  title: string
  description: string
  active: boolean
  information: TickerInformation
  mastodon: TickerMastodon
  telegram: TickerTelegram
  bluesky: TickerBluesky
  location: TickerLocation
}

export interface TickerInformation {
  author: string
  url: string
  email: string
  twitter: string
  facebook: string
  telegram: string
  mastodon: string
  bluesky: string
}

export interface TickerTelegram {
  active: boolean
  connected: boolean
  botUsername: string
  channelName: string
}

export interface TickerTelegramFormData {
  active: boolean
  channelName?: string
}

export interface TickerMastodon {
  active: boolean
  connected: boolean
  name: string
  server: string
  screen_name: string
  description: string
  imageUrl: string
}

export interface TickerMastodonFormData {
  active: boolean
  server?: string
  token?: string
  secret?: string
  accessToken?: string
}

export interface TickerBluesky {
  active: boolean
  connected: boolean
  handle: string
  appKey: string
}

export interface TickerBlueskyFormData {
  active: boolean
  handle?: string
  appKey?: string
}

export interface TickerLocation {
  lat: number
  lon: number
}

export interface GetTickersQueryParams {
  active?: boolean
  domain?: string
  title?: string
  order_by?: string
  sort?: SortDirection
}

export async function fetchTickersApi(token: string, params: GetTickersQueryParams): Promise<ApiResponse<TickersResponseData>> {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      query.append(key, String(value))
    }
  }

  return apiClient<TickersResponseData>(`${ApiUrl}/admin/tickers?${query}`, { headers: apiHeaders(token) })
}

export async function fetchTickerApi(token: string, id: number): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${id}`, { headers: apiHeaders(token) })
}

export async function deleteTickerApi(token: string, ticker: Ticker): Promise<ApiResponse<void>> {
  return apiClient<void>(`${ApiUrl}/admin/tickers/${ticker.id}`, { headers: apiHeaders(token), method: 'delete' })
}

export async function postTickerApi(token: string, data: TickerFormData): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers`, { headers: apiHeaders(token), method: 'post', body: JSON.stringify(data) })
}

export async function putTickerApi(token: string, data: TickerFormData, id: number): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${id}`, { headers: apiHeaders(token), method: 'put', body: JSON.stringify(data) })
}

export async function fetchTickerUsersApi(token: string, ticker: Ticker): Promise<ApiResponse<TickerUsersResponseData>> {
  return apiClient<TickerUsersResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/users`, { headers: apiHeaders(token) })
}

export async function deleteTickerUserApi(token: string, ticker: Ticker, user: User): Promise<ApiResponse<void>> {
  return apiClient<void>(`${ApiUrl}/admin/tickers/${ticker.id}/users/${user.id}`, { headers: apiHeaders(token), method: 'delete' })
}

export async function putTickerUsersApi(token: string, ticker: Ticker, users: User[]): Promise<ApiResponse<TickerUsersResponseData>> {
  return apiClient<TickerUsersResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/users`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify({ users: users }),
  })
}

export async function putTickerResetApi(token: string, ticker: Ticker): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/reset`, { headers: apiHeaders(token), method: 'put' })
}

export async function putTickerMastodonApi(token: string, data: TickerMastodonFormData, ticker: Ticker): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/mastodon`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}

export async function deleteTickerMastodonApi(token: string, ticker: Ticker): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/mastodon`, { headers: apiHeaders(token), method: 'delete' })
}

export async function putTickerTelegramApi(token: string, data: TickerTelegramFormData, ticker: Ticker): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/telegram`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}

export async function deleteTickerTelegramApi(token: string, ticker: Ticker): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/telegram`, { headers: apiHeaders(token), method: 'delete' })
}

export async function putTickerBlueskyApi(token: string, data: TickerBlueskyFormData, ticker: Ticker): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/bluesky`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}

export async function deleteTickerBlueskyApi(token: string, ticker: Ticker): Promise<ApiResponse<TickerResponseData>> {
  return apiClient<TickerResponseData>(`${ApiUrl}/admin/tickers/${ticker.id}/bluesky`, { headers: apiHeaders(token), method: 'delete' })
}
