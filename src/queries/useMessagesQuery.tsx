import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchMessagesApi } from '../api/Message'
import { Ticker } from '../api/Ticker'

interface Props {
  token: string
  ticker: Ticker
}

const useMessagesQuery = ({ token, ticker }: Props) => {
  return useInfiniteQuery({
    queryKey: ['messages', ticker.id],
    queryFn: ({ pageParam = 0 }) => {
      return fetchMessagesApi(token, ticker.id, pageParam)
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage?.data?.messages.length === 10 ? lastPage.data.messages.slice(-1).pop()?.id : undefined
    },
  })
}

export default useMessagesQuery
