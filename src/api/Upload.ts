import { ApiResponse, ApiUrl, apiClient } from './Api'

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

export async function postUploadApi(token: string, formData: FormData): Promise<ApiResponse<UploadeResponseData>> {
  return apiClient<UploadeResponseData>(`${ApiUrl}/admin/upload`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'post',
    body: formData,
  })
}
