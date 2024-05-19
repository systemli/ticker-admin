import { ApiResponse, ApiUrl, apiClient, apiHeaders } from './Api'

interface FeaturesResponseData {
  features: Features
}

export interface Features {
  telegramEnabled: boolean
}

export async function fetchFeaturesApi(token: string): Promise<ApiResponse<FeaturesResponseData>> {
  return apiClient<FeaturesResponseData>(`${ApiUrl}/admin/features`, { headers: apiHeaders(token) })
}
