import { FC, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Ticker } from '../../api/Ticker'
import { useMessageApi } from '../../api/Message'
import Message from './Message'
import useAuth from '../useAuth'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'
import { Button, CircularProgress } from '@mui/material'

interface Props {
  ticker: Ticker
}

const MessageList: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { getMessages } = useMessageApi(token)

  const fetchMessages = ({ pageParam = 0 }) => {
    return getMessages(ticker.id, pageParam)
  }

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ['messages', ticker.id],
    queryFn: fetchMessages,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.data.messages.length === 10 ? lastPage.data.messages.slice(-1).pop()?.id : undefined
    },
  })

  useEffect(() => {
    let fetching = false

    const handleScroll = async (e: Event) => {
      const target = e.target as Document
      if (target === null || target.scrollingElement === null) {
        return
      }

      const { scrollHeight, scrollTop, clientHeight } = target.scrollingElement
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true
        if (hasNextPage) await fetchNextPage()
        fetching = false
      }
    }

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage])

  if (status === 'pending') {
    return <Loader />
  }

  if (status === 'error') {
    return <ErrorView queryKey={['messages', ticker.id]}>Unable to fetch messages from server.</ErrorView>
  }

  return (
    <>
      {data.pages.map(group => group.data.messages.map(message => <Message key={message.id} message={message} ticker={ticker} />))}
      {isFetchingNextPage ? (
        <CircularProgress size="3rem" />
      ) : hasNextPage ? (
        <Button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()} variant="outlined">
          Load More
        </Button>
      ) : null}
    </>
  )
}

export default MessageList
