import { useQuery } from '@tanstack/react-query'
import { fetchUsersApi } from '../api/User'

interface Props {
  token: string
}

const useUsersQuery = ({ token }: Props) => {
  return useQuery({ queryKey: ['users'], queryFn: () => fetchUsersApi(token) })
}

export default useUsersQuery
