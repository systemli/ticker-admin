import { SortDirection } from '@mui/material'
import { ApiUrl, Response } from './Api'
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

export interface TickerLocation {
  lat: number
  lon: number
}

export interface GetTickersQueryParams {
  active?: boolean
  domain?: string
  title?: string
  order_by: string
  sort: SortDirection
}

export function useTickerApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const deleteTicker = (ticker: Ticker): Promise<Response<void>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  const getTickerUsers = (ticker: Ticker): Promise<Response<TickerUsersResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/users`, {
      headers: headers,
    }).then(response => response.json())
  }

  const deleteTickerUser = (ticker: Ticker, user: User): Promise<Response<void>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/users/${user.id}`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  const getTickers = (params: GetTickersQueryParams): Promise<Response<TickersResponseData>> => {
    const query = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        query.append(key, String(value))
      }
    }

    return fetch(`${ApiUrl}/admin/tickers?${query}`, { headers: headers }).then(response => response.json())
  }

  const getTicker = (id: number): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${id}`, { headers: headers }).then(response => response.json())
  }

  const postTicker = (data: Ticker): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers`, {
      headers: headers,
      body: JSON.stringify(data),
      method: 'post',
    }).then(response => response.json())
  }

  const putTicker = (data: Ticker, id: number): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${id}`, {
      headers: headers,
      body: JSON.stringify(data),
      method: 'put',
    }).then(response => response.json())
  }

  const putTickerUsers = (ticker: Ticker, users: User[]): Promise<Response<TickerUsersResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/users`, {
      headers: headers,
      method: 'put',
      body: JSON.stringify({ users: users }),
    }).then(response => response.json())
  }

  const putTickerReset = (ticker: Ticker): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/reset`, {
      headers: headers,
      method: 'put',
    }).then(response => response.json())
  }

  const putTickerMastodon = (data: TickerMastodonFormData, ticker: Ticker): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/mastodon`, {
      headers: headers,
      body: JSON.stringify(data),
      method: 'put',
    }).then(response => response.json())
  }

  const deleteTickerMastodon = (ticker: Ticker): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/mastodon`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  const putTickerTelegram = (data: TickerTelegramFormData, ticker: Ticker): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/telegram`, {
      headers: headers,
      body: JSON.stringify(data),
      method: 'put',
    }).then(response => response.json())
  }

  const deleteTickerTelegram = (ticker: Ticker): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/telegram`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  return {
    deleteTicker,
    deleteTickerUser,
    getTickers,
    getTicker,
    getTickerUsers,
    postTicker,
    putTicker,
    putTickerUsers,
    putTickerReset,
    putTickerMastodon,
    deleteTickerMastodon,
    putTickerTelegram,
    deleteTickerTelegram,
  }
}
