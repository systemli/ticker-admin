import { ApiUrl, Response } from './Api'
import AuthSingleton from '../components/AuthService'
import { User } from './User'

const Auth = AuthSingleton.getInstance()

interface TickersResponse {
  data: {
    tickers: Array<Ticker>
  }
}

interface TickerResponse {
  data: {
    ticker: Ticker
  }
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
}

export interface TickerLocation {
  lat: number
  lon: number
}

export function getTickers(): Promise<TickersResponse> {
  return Auth.fetch(`${ApiUrl}/admin/tickers`)
}

export function getTicker(id: number): Promise<TickerResponse> {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`)
}

export function postTicker(data: any): Promise<TickerResponse> {
  return Auth.fetch(`${ApiUrl}/admin/tickers`, {
    body: JSON.stringify(data),
    method: 'POST',
  })
}

export function putTicker(data: any, id: number): Promise<TickerResponse> {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`, {
    body: JSON.stringify(data),
    method: 'PUT',
  })
}

/**
 *
 * @param data
 * @param id
 * @returns {Promise<any>}
 */
export function putTickerTwitter(data: any, id: number) {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}/twitter`, {
    body: JSON.stringify(data),
    method: 'PUT',
  })
}

export function deleteTicker(id: number) {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`, {
    method: 'DELETE',
  })
}

/**
 *
 * @param {string|number} id
 * @returns {Promise<Response>}
 */
export function getTickerUsers(id: number) {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}/users`)
}

/**
 * @param id
 * @param users
 * @returns {Promise<Response>}
 */
export function putTickerUser(id: number, ...users: any) {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}/users`, {
    body: JSON.stringify({ users: users }),
    method: 'PUT',
  })
}

/**
 * @param id
 * @param userId
 * @returns {Promise<Response>}
 */
export function deleteTickerUser(id: number, userId: number) {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}/users/${userId}`, {
    method: 'DELETE',
  })
}

export function useTickerApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
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
  ): Promise<Response<TickerResponse>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker.id}/reset`, {
      headers: headers,
      method: 'put',
    }).then(response => response.json())
  }

  return { deleteTickerUser, getTickerUsers, putTickerUsers, putTickerReset }
}
