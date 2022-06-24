import React, { FC, useState } from 'react'
import { Container, Grid, Header, Loader } from 'semantic-ui-react'
import { getTicker, Ticker } from '../api/Ticker'
import Navigation from './Navigation'
import TickerUserList from '../components/TickerUserList'
import TickerResetButton from '../components/TickerResetButton'
import MessageForm from '../components/MessageForm'
import { useQuery } from 'react-query'
import TickerCard from '../components/TickerCard'
import { useParams } from 'react-router-dom'
import MessageList from '../components/MessageList'
import useAuth from '../components/useAuth'

interface TickerViewParams {
  tickerId: string
}

const TickerView: FC = () => {
  const { tickerId } = useParams<keyof TickerViewParams>() as TickerViewParams
  const { user } = useAuth()
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
    if (user?.roles.includes('admin')) {
      return (
        <React.Fragment>
          <Header dividing>Users</Header>
          <TickerUserList id={tickerIdNum} />
        </React.Fragment>
      )
    }
  }

  const renderDangerZone = () => {
    if (user?.roles.includes('admin')) {
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
      <Navigation />
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

export default TickerView
