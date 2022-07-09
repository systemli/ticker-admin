import React, { FC } from 'react'
import { Button, Container, Grid, Header, Loader } from 'semantic-ui-react'
import { getTicker } from '../api/Ticker'
import Navigation from './Navigation'
import MessageForm from '../components/MessageForm'
import { useQuery } from 'react-query'
import TickerCard from '../components/TickerCard'
import { useParams } from 'react-router-dom'
import MessageList from '../components/MessageList'
import useAuth from '../components/useAuth'
import TickerUsersCard from '../components/TickerUserCard'
import TickerResetModal from '../components/TickerResetModal'

interface TickerViewParams {
  tickerId: string
}

const TickerView: FC = () => {
  const { tickerId } = useParams<keyof TickerViewParams>() as TickerViewParams
  const { user } = useAuth()
  const tickerIdNum = parseInt(tickerId)

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

  const ticker = data.data.ticker

  const renderUsers = () => {
    if (user?.roles.includes('admin')) {
      return (
        <React.Fragment>
          <Header dividing>Users</Header>
          <TickerUsersCard ticker={ticker} />
        </React.Fragment>
      )
    }
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
              <MessageForm ticker={ticker} />
              <MessageList ticker={ticker} />
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
              {user?.roles.includes('admin') && (
                <React.Fragment>
                  <Header dividing>Danger Zone</Header>
                  <TickerResetModal
                    ticker={ticker}
                    trigger={
                      <Button
                        content="Reset"
                        icon="remove"
                        labelPosition="left"
                        negative
                        size="tiny"
                      />
                    }
                  />
                </React.Fragment>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Container>
  )
}

export default TickerView
