import { useQuery } from '@tanstack/react-query'
import { fetchSignalGroupSettingsApi } from '../api/Settings'

interface Props {
  token: string
}

const useSignalGroupSettingsQuery = ({ token }: Props) => {
  return useQuery({ queryKey: ['signal_group_settings'], queryFn: () => fetchSignalGroupSettingsApi(token) })
}

export default useSignalGroupSettingsQuery
