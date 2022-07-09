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
  creation_date: Date
  tweet_id: string
  tweet_user: string
  geo_information: string
  // TODO
  attachments: any[]
}

export function useMessageApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const getMessages = (
    ticker: number
  ): Promise<Response<MessagesResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`, {
      headers: headers,
    }).then(response => response.json())
  }

  // TODO: any
  const postMessage = (
    ticker: string,
    text: string,
    geoInformation: any,
    attachments: any[]
  ): Promise<Response<MessageResponseData>> => {
    return fetch(`${ApiUrl}/admin/tickers/${ticker}/messages`, {
      headers: headers,
      body: JSON.stringify({
        text: text,
        geo_information: geoInformation,
        attachments: attachments,
      }),
      method: 'post',
    }).then(response => response.json())
  }

  const deleteMessage = (message: Message): Promise<Response<any>> => {
    return fetch(
      `${ApiUrl}/admin/tickers/${message.ticker}/messages/${message.id}`,
      {
        headers: headers,
        method: 'delete',
      }
    ).then(response => response.json())
  }

  return { deleteMessage, getMessages, postMessage }
}
