import { ApiUrl, Response } from './Api'
import { Ticker } from './Ticker'

export interface UsersResponseData {
  users: Array<User>
}

export interface UserResponseData {
  user: User
}

export interface User {
  id: number
  createdAt: Date
  email: string
  role: string
  isSuperAdmin: boolean
  tickers?: Array<Ticker>
}

export interface UserData {
  email: string
  isSuperAdmin: boolean
  password?: string
}

export interface MeData {
  password: string
  newPassword: string
}

export function useUserApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const getUsers = (): Promise<Response<UsersResponseData>> => {
    return fetch(`${ApiUrl}/admin/users`, { headers: headers }).then(response => response.json())
  }

  const putUser = (data: UserData, user: User): Promise<Response<UserResponseData>> => {
    return fetch(`${ApiUrl}/admin/users/${user.id}`, {
      body: JSON.stringify(data),
      method: 'put',
      headers: { ...headers, 'Content-Type': 'application/json' },
    }).then(response => response.json())
  }

  const postUser = (data: UserData): Promise<Response<UserResponseData>> => {
    return fetch(`${ApiUrl}/admin/users`, {
      body: JSON.stringify(data),
      headers: headers,
      method: 'post',
    }).then(response => response.json())
  }

  const deleteUser = (user: User): Promise<Response<void>> => {
    return fetch(`${ApiUrl}/admin/users/${user.id}`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  const putMe = (data: MeData): Promise<Response<UserResponseData>> => {
    return fetch(`${ApiUrl}/admin/users/me`, {
      body: JSON.stringify(data),
      headers: headers,
      method: 'put',
    }).then(response => response.json())
  }

  return { getUsers, putUser, postUser, deleteUser, putMe }
}
