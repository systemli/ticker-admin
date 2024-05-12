import { useQuery } from '@tanstack/react-query'
import { useTickerApi } from '../api/Ticker'

interface Props {
  id: number
  token: string
}

const useTickerQuery = ({ id, token }: Props) => {
  const { getTicker } = useTickerApi(token)

  return useQuery({
    queryKey: ['ticker', id],
    queryFn: () => getTicker(id),
  })
}

export default useTickerQuery
