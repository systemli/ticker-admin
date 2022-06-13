import React, { FC, useEffect, useState } from 'react'
import { Container, Feed, Grid, Header, Loader } from 'semantic-ui-react'
import { getTicker, Ticker } from '../api/Ticker'
import { getMessages } from '../api/Message'
import Message from '../components/Message'
import withAuth from '../components/withAuth'
import Navigation from './Navigation'
import TickerUserList from '../components/TickerUserList'
import TickerResetButton from '../components/TickerResetButton'
import MessageForm from '../components/MessageForm'
import TwitterCard from '../components/TwitterCard'
import { useQuery } from 'react-query'
import TickerCard from '../components/TickerCard'

interface Props {
  // ticker id
  id: number
  // TODO: any
  history: any
  user: any
}

const TickerView: FC<Props> = props => {
  const [ticker, setTicker] = useState<Ticker>()
  const [isConfigurationLoading, setIsConfigurationLoading] =
    useState<boolean>(false)
  const { isLoading, error, data } = useQuery(['messages', props.id], () =>
    getMessages(props.id)
  )

  useEffect(() => {
    loadTicker()
  })

  const loadTicker = () => {
    getTicker(props.id).then(response => {
      if (response.data?.ticker !== undefined) {
        setTicker(response.data.ticker)
        setIsConfigurationLoading(false)
      }
    })
  }

  const renderMessages = () => {
    if (data?.data.messages && data.data.messages.length > 0) {
      return (
        <Feed>
          {data?.data.messages.map(message => (
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
          <TickerUserList id={props.id} />
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
    // this.setState({ ticker: ticker, messages: [] })
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
