import React, { FC } from 'react'
import {
  Button,
  Dimmer,
  Grid,
  Header,
  Loader,
  Message,
} from 'semantic-ui-react'
import TickerList from '../components/TickerList'
import useAuth from '../components/useAuth'
import { useTickerApi } from '../api/Ticker'
import { useQuery } from 'react-query'
import Ticker from '../components/Ticker'
import TickerModalForm from '../components/TickerModalForm'
import Layout from './Layout'

const HomeView: FC = () => {
  const { token, user } = useAuth()
  const { getTickers } = useTickerApi(token)
  const { isLoading, error, data } = useQuery('tickers', getTickers, {
    refetchInterval: false,
  })

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

  const tickers = data.data.tickers

  if (tickers.length === 0 && user?.roles.includes('admin')) {
    return (
      <Layout>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={6}>
              <Message info>
                <Message.Header>Welcome!</Message.Header>
                <p>You need to create a your first ticker.</p>
                <p>
                  <TickerModalForm
                    trigger={
                      <Button
                        color="green"
                        content="Create"
                        icon="plus"
                        labelPosition="left"
                        size="small"
                      />
                    }
                  />
                </p>
              </Message>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }

  if (tickers.length === 1 && !user?.roles.includes('admin')) {
    return <Ticker ticker={tickers[0]} />
  }

  return (
    <Layout>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header dividing>Available Configurations</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <TickerList tickers={tickers} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  )
}

export default HomeView
