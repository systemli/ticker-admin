import React, { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Ticker } from '../../api/Ticker'
import { useMessageApi } from '../../api/Message'
import Message from './Message'
import useAuth from '../useAuth'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'

interface Props {
  ticker: Ticker
}

const MessageList: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { getMessages } = useMessageApi(token)
  const { isLoading, error, data } = useQuery(['messages', ticker.id], () =>
    getMessages(ticker.id)
  )

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined) {
    return (
      <ErrorView queryKey={['messages', ticker.id]}>
        Unable to fetch messages from server.
      </ErrorView>
    )
  }

  return (
    <>
      {data.data.messages.map(message => (
        <Message key={message.id} message={message} ticker={ticker} />
      ))}
    </>
  )
}

export default MessageList
