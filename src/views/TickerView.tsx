import React, { FC, useCallback, useEffect, useState } from 'react'
import { Container, Feed, Grid, Header, Loader } from 'semantic-ui-react'
import { getTicker, Ticker } from '../api/Ticker'
import { getMessages, Message as MessageType } from '../api/Message'
import Message from '../components/Message'
import withAuth from '../components/withAuth'
import Navigation from './Navigation'
import TickerUserList from '../components/TickerUserList'
import TickerResetButton from '../components/TickerResetButton'
import MessageForm from '../components/MessageForm'
import TwitterCard from '../components/TwitterCard'
import { useQuery } from 'react-query'
import TickerCard from '../components/TickerCard'
import { useParams } from 'react-router-dom'
import { User } from '../api/User'

interface Props {
  user: User
}

interface TickerViewParams {
  tickerId: string
}

const TickerView: FC<Props> = props => {
  const { tickerId } = useParams<TickerViewParams>()
  const tickerIdNum = parseInt(tickerId)

  const [ticker, setTicker] = useState<Ticker>()
  const [messages, setMessages] = useState<Array<MessageType>>([])
  const [isConfigurationLoading, setIsConfigurationLoading] =
    useState<boolean>(false)

  const { isLoading, error, data } = useQuery(
    ['messages', tickerIdNum],
    () => getMessages(tickerIdNum),
    { refetchInterval: false }
  )

  const loadTicker = useCallback(() => {
    getTicker(tickerIdNum).then(response => {
      if (response.data?.ticker !== undefined) {
        setTicker(response.data.ticker)
        setIsConfigurationLoading(false)
      }
    })
  }, [tickerIdNum])

  useEffect(() => {
    loadTicker()
  }, [loadTicker])

  useEffect(() => {
    if (data?.data.messages !== undefined) {
      setMessages(data?.data.messages)
    }
  }, [data?.data.messages])

  const renderMessages = () => {
    if (messages.length > 0) {
      return (
        <Feed>
          {messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </Feed>
      )
    }
  }

  const renderUsers = () => {
    if (props.user?.is_super_admin) {
      return (
        <React.Fragment>
          <Header dividing>Users</Header>
          <TickerUserList id={tickerIdNum} />
        </React.Fragment>
      )
    }
  }

  const renderDangerZone = () => {
    if (props.user?.is_super_admin) {
      return (
        <React.Fragment>
          <Header dividing>Danger Zone</Header>
          <TickerResetButton reset={reset} ticker={ticker} />
        </React.Fragment>
      )
    }
  }

  const reset = () => {
    setTicker(ticker)
    setMessages([])
  }

  const renderTicker = () => {
    if (ticker !== undefined) {
      return <TickerCard ticker={ticker} />
    }
  }

  return (
    <Container>
      <Navigation user={props.user} />
      <Container className="app">
        <Loader active={isConfigurationLoading || isLoading} size="large" />
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={10}>
              <Header dividing>Messages</Header>
              {/* <MessageForm
                callback={this.loadMessages}
                ticker={this.state.ticker}
              /> */}
              {renderMessages()}
            </Grid.Column>
            <Grid.Column width={6}>
              <Header dividing>Configuration</Header>
              {renderTicker()}
              <Header dividing>Twitter</Header>
              {/* <TwitterCard
                callback={ticker => setTicker(ticker)}
                ticker={ticker}
              /> */}
              {renderUsers()}
              {renderDangerZone()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Container>
  )
}

export default withAuth(TickerView)
