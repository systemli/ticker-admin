import { ApiUrl } from './Api'

interface LoginResponse {
  code: number
  expire: Date
  token: string
}

export function login(username: string, password: string): Promise<LoginResponse> {
  return fetch(`${ApiUrl}/admin/login`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify({ username, password }),
  })
    .then(response => {
      if (!response.ok) throw new Error('Login failed')

      return response.json()
    })
    .catch(() => {
      throw new Error('Login failed')
    })
}
