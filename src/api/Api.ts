export const ApiUrl =
  process.env.REACT_APP_API_URL || 'http://localhost:8080/v1'

type StatusSuccess = 'success'
type StatusError = 'error'
type Status = StatusSuccess | StatusError

export interface Response<T> {
  data: T
  status: Status
  error?: {
    code: number
    message: string
  }
}
