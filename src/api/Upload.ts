import { ApiUrl, Response } from './Api'

interface UploadeResponseData {
  uploads: Array<Upload>
}

export interface Upload {
  id: number
  uuid: string
  createdAt: Date
  url: string
  content_type: string
}

export function useUploadApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const postUpload = (formData: any): Promise<Response<UploadeResponseData>> => {
    return fetch(`${ApiUrl}/admin/upload`, {
      headers: headers,
      body: formData,
      method: 'post',
    }).then(response => response.json())
  }

  return { postUpload }
}
