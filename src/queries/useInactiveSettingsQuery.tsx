import { useQuery } from '@tanstack/react-query'
import { fetchInactiveSettingsApi } from '../api/Settings'

interface Props {
  token: string
}

const useInactiveSettingsQuery = ({ token }: Props) => {
  return useQuery({ queryKey: ['inactive_settings'], queryFn: () => fetchInactiveSettingsApi(token) })
}

export default useInactiveSettingsQuery
