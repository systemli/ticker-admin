import { ApiResponse, ApiUrl, apiClient, apiHeaders } from './Api'

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
  createdAt: string
  telegramUrl?: string
  mastodonUrl?: string
  blueskyUrl?: string
  attachments?: Attachment[]
}

export interface Attachment {
  url: string
  contentType: string
}

export async function fetchMessagesApi(token: string, ticker: number, before?: number, after?: number, limit = 10): Promise<ApiResponse<MessagesResponseData>> {
  let params = `limit=${limit}`

  if (before) {
    params += `&before=${before}`
  }

  if (after) {
    params += `&after=${after}`
  }

  return apiClient<MessagesResponseData>(`${ApiUrl}/admin/tickers/${ticker}/messages?${params}`, {
    headers: apiHeaders(token),
  })
}

export async function postMessageApi(token: string, ticker: string, text: string, attachments: number[]): Promise<ApiResponse<MessageResponseData>> {
  return apiClient<MessageResponseData>(`${ApiUrl}/admin/tickers/${ticker}/messages`, {
    headers: apiHeaders(token),
    method: 'post',
    body: JSON.stringify({
      text: text,
      attachments: attachments,
    }),
  })
}

export async function deleteMessageApi(token: string, message: Message): Promise<ApiResponse<void>> {
  return apiClient<void>(`${ApiUrl}/admin/tickers/${message.ticker}/messages/${message.id}`, {
    headers: apiHeaders(token),
    method: 'delete',
  })
}
