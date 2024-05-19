import { Button, CircularProgress } from '@mui/material'
import { FC, useEffect } from 'react'
import { Ticker } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useMessagesQuery from '../../queries/useMessagesQuery'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'
import Message from './Message'

interface Props {
  ticker: Ticker
}

const MessageList: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useMessagesQuery({ token, ticker })

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
      {data.pages.map(group => group.data?.messages.map(message => <Message key={message.id} message={message} ticker={ticker} />))}
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
