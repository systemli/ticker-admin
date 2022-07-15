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
  creation_date: Date
  domain: string
  title: string
  description: string
  active: boolean
  information: TickerInformation
  twitter: TickerTwitter
  location: TickerLocation
}

export interface TickerInformation {
  author: string
  url: string
  email: string
  twitter: string
  facebook: string
}

export interface TickerTwitter {
  active: boolean
  connected: boolean
  name: string
  screen_name: string
  description: string
  image_url: string
}

export interface TickerTwitterFormData {
  active: boolean
  disconnect: boolean
  token: string
  secret: string
}

export interface TickerLocation {
  lat: number
  lon: number
}

export function useTickerApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const deleteTicker = (ticker: Ticker): Promise<Response<any>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  const getTickerUsers = (
    ticker: Ticker
  ): Promise<Response<TickerUsersResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/users`, {
      headers: headers,
    }).then(response => response.json())
  }

  const deleteTickerUser = (
    ticker: Ticker,
    user: User
  ): Promise<Response<any>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/users/${user.id}`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  const getTickers = (): Promise<Response<TickersResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers`, { headers: headers }).then(
      response => response.json()
    )
  }

  const getTicker = (id: number): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${id}`, { headers: headers }).then(
      response => response.json()
    )
  }

  const postTicker = (data: any): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers`, {
      headers: headers,
      body: JSON.stringify(data),
      method: 'post',
    }).then(response => response.json())
  }

  const putTicker = (
    data: any,
    id: number
  ): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${id}`, {
      headers: headers,
      body: JSON.stringify(data),
      method: 'put',
    }).then(response => response.json())
  }

  const putTickerUsers = (
    ticker: Ticker,
    users: number[]
  ): Promise<Response<TickerUsersResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/users`, {
      headers: headers,
      method: 'put',
      body: JSON.stringify({ users: users }),
    }).then(response => response.json())
  }

  const putTickerReset = (
    ticker: Ticker
  ): Promise<Response<TickerResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/reset`, {
      headers: headers,
      method: 'put',
    }).then(response => response.json())
  }

  const putTickerTwitter = (data: TickerTwitterFormData, ticker: Ticker) => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/twitter`, {
      headers: headers,
      body: JSON.stringify(data),
      method: 'put',
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
    putTickerTwitter,
  }
}
