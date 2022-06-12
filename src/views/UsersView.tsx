import React, { FC } from 'react'
import withAuth from '../components/withAuth'
import { Container, Grid, Header } from 'semantic-ui-react'
import Navigation from './Navigation'
import UserList from '../components/UserList'

interface Props {
  history: History
  user: any
}

const UsersView: FC<Props> = props => {
  return (
    <Container>
      <Navigation history={props.history} user={props.user} />
      <Container className="app">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header dividing>Users</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <UserList />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Container>
  )
}

export default withAuth(UsersView)
