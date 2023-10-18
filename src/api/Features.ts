import { ApiUrl, Response } from './Api'

interface FeaturesResponseData {
  features: Features
}

export interface Features {
  telegramEnabled: boolean
}

export function useFeatureApi(token: string) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const getFeatures = (): Promise<Response<FeaturesResponseData>> => {
    return fetch(`${ApiUrl}/admin/features`, {
      headers: headers,
    }).then(response => response.json())
  }

  return { getFeatures }
}
