import { ApiUrl, Response } from './Api'
import AuthSingleton from '../components/AuthService'

const Auth = AuthSingleton.getInstance()

interface MessagesResponseData {
  messages: Array<Message>
}

interface MessageResponseData {
  message: Message
}

export interface Message {
  id: number
  ticker: number
  text: string
  creation_date: Date
  tweet_id: string
  tweet_user: string
  geo_information: string
  // TODO
  attachments: any[]
}

export function getMessages(
  ticker: number
): Promise<Response<MessagesResponseData>> {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`)
}

// TODO: any
export function postMessage(
  ticker: string,
  text: string,
  geoInformation: any,
  attachments: any[]
): Promise<Response<MessageResponseData>> {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`, {
    body: JSON.stringify({
      text: text,
      geo_information: geoInformation,
      attachments: attachments,
    }),
    method: 'POST',
  })
}

export function deleteMessage(
  ticker: string,
  message: string
): Promise<Response<any>> {
  return Auth.fetch(`${ApiUrl}/admin/tickers/${ticker}/messages/${message}`, {
    method: 'DELETE',
  })
}
