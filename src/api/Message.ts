import { ApiUrl, Response } from './Api'

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
  createdAt: Date
  telegramUrl?: string
  mastodonUrl?: string
  geoInformation: string
  // TODO
  attachments: any[]
}

export function useMessageApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const getMessages = (ticker: number, before?: number, after?: number, limit = 10): Promise<Response<MessagesResponseData>> => {
    let params = `limit=${limit}`

    if (before) {
      params += `&before=${before}`
    }

    if (after) {
      params += `&after=${after}`
    }

    return fetch(`${ApiUrl}/admin/tickers/${ticker}/messages?${params}`, {
      headers: headers,
    }).then(response => response.json())
  }

  // TODO: any
  const postMessage = (ticker: string, text: string, geoInformation: any, attachments: any[]): Promise<Response<MessageResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`, {
      headers: headers,
      body: JSON.stringify({
        text: text,
        geoInformation: geoInformation,
        attachments: attachments,
      }),
      method: 'post',
    }).then(response => response.json())
  }

  const deleteMessage = (message: Message): Promise<Response<any>> => {
    return fetch(`${ApiUrl}/admin/tickers/${message.ticker}/messages/${message.id}`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  return { deleteMessage, getMessages, postMessage }
}
