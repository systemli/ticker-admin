import React, { FC, useState } from 'react'
import { Container, Grid, Header, Loader } from 'semantic-ui-react'
import { getTicker, Ticker } from '../api/Ticker'
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
import MessageList from '../components/MessageList'

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

  const { isLoading, error, data } = useQuery(
    ['ticker', tickerIdNum],
    () => getTicker(tickerIdNum),
    { refetchInterval: false }
  )

  if (isLoading) {
    return <Loader size="large" />
  }

  if (error || data === undefined) {
    //TODO: Generic Error View
    return <React.Fragment>Error occured</React.Fragment>
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
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={10}>
              <Header dividing>Messages</Header>
              <MessageForm ticker={data.data.ticker} />
              <MessageList ticker={data.data.ticker} />
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
