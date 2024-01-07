export const ApiUrl = import.meta.env.TICKER_API_URL

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
