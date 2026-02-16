import { useQuery } from '@tanstack/react-query'
import { fetchTelegramSettingsApi } from '../api/Settings'

interface Props {
  token: string
}

const useTelegramSettingsQuery = ({ token }: Props) => {
  return useQuery({ queryKey: ['telegram_settings'], queryFn: () => fetchTelegramSettingsApi(token) })
}

export default useTelegramSettingsQuery
