import { ApiResponse, ApiUrl, apiClient, apiHeaders } from './Api'
import { Ticker } from './Ticker'

export interface UsersResponseData {
  users: Array<User>
}

export interface UserResponseData {
  user: User
}

export interface User {
  id: number
  createdAt: string
  lastLogin: string
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

export async function fetchUsersApi(token: string): Promise<ApiResponse<UsersResponseData>> {
  return apiClient<UsersResponseData>(`${ApiUrl}/admin/users`, { headers: apiHeaders(token) })
}

export async function putUserApi(token: string, user: User, data: UserData): Promise<ApiResponse<UserResponseData>> {
  return apiClient<UserResponseData>(`${ApiUrl}/admin/users/${user.id}`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}

export async function postUserApi(token: string, data: UserData): Promise<ApiResponse<UserResponseData>> {
  return apiClient<UserResponseData>(`${ApiUrl}/admin/users`, {
    headers: apiHeaders(token),
    method: 'post',
    body: JSON.stringify(data),
  })
}

export async function deleteUserApi(token: string, user: User): Promise<ApiResponse<void>> {
  return apiClient<void>(`${ApiUrl}/admin/users/${user.id}`, {
    headers: apiHeaders(token),
    method: 'delete',
  })
}

export async function putMeApi(token: string, data: MeData): Promise<ApiResponse<UserResponseData>> {
  return apiClient<UserResponseData>(`${ApiUrl}/admin/users/me`, {
    headers: apiHeaders(token),
    method: 'put',
    body: JSON.stringify(data),
  })
}
