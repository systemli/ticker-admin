import { ApiUrl, Response } from './Api'

interface UploadeResponseData {
  uploads: Array<Upload>
}

interface Upload {
  id: number
  uuid: string
  creation_date: Date
  url: string
  content_type: string
}

export function useMessageApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const postUpload = (
    formData: any
  ): Promise<Response<UploadeResponseData>> => {
    return fetch(`${ApiUrl}/admin/upload`, {
      headers: headers,
      body: formData,
      method: 'post',
    }).then(response => response.json())
  }

  return { postUpload }
}
