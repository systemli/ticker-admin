import { useQuery } from '@tanstack/react-query'
import { fetchRefreshIntervalApi } from '../api/Settings'

interface Props {
  token: string
}

const useRefreshIntervalSettingsQuery = ({ token }: Props) => {
  return useQuery({ queryKey: ['refresh_interval_setting'], queryFn: () => fetchRefreshIntervalApi(token) })
}

export default useRefreshIntervalSettingsQuery
