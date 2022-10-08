import React, { FC } from 'react'
import {
  Button,
  Dimmer,
  Grid,
  Header,
  Loader,
  Message,
} from 'semantic-ui-react'
import TickerList from '../components/ticker/TickerList'
import useAuth from '../components/useAuth'
import { useTickerApi } from '../api/Ticker'
import { useQuery } from '@tanstack/react-query'
import TickerModalForm from '../components/ticker/TickerModalForm'
import Layout from './Layout'
import ErrorView from './ErrorView'
import { Navigate } from 'react-router'

const HomeView: FC = () => {
  const { token, user } = useAuth()
  const { getTickers } = useTickerApi(token)
  const { isLoading, error, data } = useQuery(['tickers'], getTickers)

  if (isLoading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    )
  }

  if (error || data === undefined) {
    return (
      <Layout>
        <ErrorView>Unable to fetch tickers from server.</ErrorView>
      </Layout>
    )
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
    return <Navigate replace to={`/ticker/${tickers[0].id}`} />
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
