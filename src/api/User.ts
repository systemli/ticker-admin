import { ApiUrl } from './Api'
import AuthSingleton from '../components/AuthService'

const Auth = AuthSingleton.getInstance()

export interface UsersResponse {
  data: UsersResponseData
}

export interface UsersResponseData {
  users: Array<User>
}

export interface UserResponse {
  data: UserResponseData
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

export function getUsers(): Promise<UsersResponse> {
  return Auth.fetch(`${ApiUrl}/admin/users`)
}

export function postUser(data: UserData): Promise<UserResponse> {
  return Auth.fetch(`${ApiUrl}/admin/users`, {
    body: JSON.stringify(data),
    method: 'post',
  })
}

export function putUser(data: UserData, user: User): Promise<UserResponse> {
  return Auth.fetch(`${ApiUrl}/admin/users/${user.id}`, {
    body: JSON.stringify(data),
    method: 'put',
  })
}

export function deleteUser(user: User): Promise<Response> {
  return Auth.fetch(`${ApiUrl}/admin/users/${user.id}`, {
    method: 'delete',
  })
}
