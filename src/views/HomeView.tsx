import React, { FC } from 'react'
import { Container, Grid, Header } from 'semantic-ui-react'
import withAuth from '../components/withAuth'
import Navigation from './Navigation'
import TickerList from '../components/TickerList'
import { User } from '../api/User'

interface Props {
  history: History
  user: User
}

const HomeView: FC<Props> = props => {
  return (
    <Container>
      <Navigation user={props.user} />
      <Container className="app">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header dividing>Available Configurations</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <TickerList user={props.user} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Container>
  )
}

export default withAuth(HomeView)