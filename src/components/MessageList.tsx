import React, { FC } from 'react'
import { Dimmer, Feed, Loader } from 'semantic-ui-react'
import { Ticker } from '../api/Ticker'
import { useMessageApi } from '../api/Message'
import Message from '../components/Message'
import { useQuery } from '@tanstack/react-query'
import useAuth from './useAuth'

interface Props {
  ticker: Ticker
}

const MessageList: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { getMessages } = useMessageApi(token)
  const { isLoading, error, data } = useQuery(
    ['messages', ticker.id],
    () => getMessages(ticker.id),
    { refetchInterval: false }
  )

  if (isLoading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    )
  }

  if (error || data === undefined) {
    //TODO: Generic Error View
    return <React.Fragment>Error occured</React.Fragment>
  }

  return (
    <Feed>
      {data.data.messages.map(message => (
        <Message key={message.id} message={message} ticker={ticker} />
      ))}
    </Feed>
  )
}

export default MessageList
