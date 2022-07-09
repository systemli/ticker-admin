import { ApiUrl, Response } from './Api'

export interface UsersResponseData {
  users: Array<User>
}

export interface UserResponseData {
  user: User
}

export interface User {
  id: number
  creation_date: Date
  email: string
  role: string
  is_super_admin: boolean
  tickers?: Array<number>
}

export interface UserData {
  email: string
  is_super_admin: boolean
  password?: string
}

export function useUserApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const getUsers = (): Promise<Response<UsersResponseData>> => {
    return fetch(`${ApiUrl}/admin/users`, { headers: headers }).then(response =>
      response.json()
    )
  }

  const putUser = (
    data: UserData,
    user: User
  ): Promise<Response<UserResponseData>> => {
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

  const deleteUser = (user: User): Promise<Response<any>> => {
    return fetch(`${ApiUrl}/admin/users/${user.id}`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  return { getUsers, putUser, postUser, deleteUser }
}
