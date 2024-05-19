import { useQuery } from '@tanstack/react-query'
import { Ticker, fetchTickerUsersApi } from '../api/Ticker'

interface Props {
  ticker: Ticker
  token: string
}

const useTickerUsersQuery = ({ ticker, token }: Props) => {
  return useQuery({
    queryKey: ['tickerUsers'],
    queryFn: () => fetchTickerUsersApi(token, ticker),
  })
}

export default useTickerUsersQuery
