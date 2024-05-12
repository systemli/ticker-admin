import { useQuery } from '@tanstack/react-query'
import { GetTickersQueryParams, useTickerApi } from '../api/Ticker'

interface Props {
  token: string
  params: GetTickersQueryParams
}

const useTickersQuery = ({ token, params }: Props) => {
  const { getTickers } = useTickerApi(token)

  return useQuery({
    queryKey: ['tickers', params],
    queryFn: () => getTickers(params),
    placeholderData: previousData => previousData,
  })
}

export default useTickersQuery
