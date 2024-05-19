import { useQuery } from '@tanstack/react-query'
import { fetchTickerApi } from '../api/Ticker'

interface Props {
  id: number
  token: string
}

const useTickerQuery = ({ id, token }: Props) => {
  return useQuery({
    queryKey: ['ticker', id],
    queryFn: () => fetchTickerApi(token, id),
  })
}

export default useTickerQuery
