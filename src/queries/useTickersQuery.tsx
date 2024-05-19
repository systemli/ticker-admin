import { useQuery } from '@tanstack/react-query'
import { GetTickersQueryParams, fetchTickersApi } from '../api/Ticker'

interface Props {
  token: string
  params: GetTickersQueryParams
}

const useTickersQuery = ({ token, params }: Props) => {
  return useQuery({
    queryKey: ['tickers', params],
    queryFn: () => fetchTickersApi(token, params),
    placeholderData: previousData => previousData,
  })
}

export default useTickersQuery
