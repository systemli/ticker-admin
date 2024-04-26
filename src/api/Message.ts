import { ApiUrl, Response } from './Api'
import { FeatureCollection, Geometry } from 'geojson'

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
  attachments?: Attachment[]
}

export interface Attachment {
  url: string
  contentType: string
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

  const postMessage = (
    ticker: string,
    text: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geoInformation: FeatureCollection<Geometry, any>,
    attachments: number[]
  ): Promise<Response<MessageResponseData>> => {
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

  const deleteMessage = (message: Message): Promise<Response<void>> => {
    return fetch(`${ApiUrl}/admin/tickers/${message.ticker}/messages/${message.id}`, {
      headers: headers,
      method: 'delete',
    }).then(response => response.json())
  }

  return { deleteMessage, getMessages, postMessage }
}
