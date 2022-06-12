import { ApiUrl } from './Api'
import AuthSingleton from '../components/AuthService'

const Auth = AuthSingleton.getInstance()

interface TickersResponse {
  data: TickersResponseData
}

interface TickersResponseData {
  tickers: Array<Ticker>
}

interface Ticker {
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

interface TickerInformation {
  author: string
  url: string
  email: string
  twitter: string
  facebook: string
}

interface TickerTwitter {
  active: boolean
  connected: boolean
}

interface TickerLocation {
  lat: number
  lon: number
}

export function getTickers(): Promise<TickersResponse> {
  return Auth.fetch(`${ApiUrl}/admin/tickers`)
}

/**
 *
 * @param {string} id
 * @returns {Promise<Response>}
 */
export function getTicker(id: number) {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}`)
}

/**
 *
 * @param {object} data
 * @returns {Promise<Response>}
 */
export function postTicker(data: any) {
  return Auth.fetch(`${ApiUrl}/admin/tickers`, {
    body: JSON.stringify(data),
    method: 'POST',
  })
}

/**
 *
 * @param {object} data
 * @param {string} id
 * @returns {Promise<Response>}
 */
export function putTicker(data: any, id: number) {
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

/**
 *
 * @param id
 */
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

/**
 * @param id
 * @returns {Promise<Response>}
 */
export function putTickerReset(id: number) {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${id}/reset`, {
    method: 'PUT',
  })
}
