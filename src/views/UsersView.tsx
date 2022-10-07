import React, { FC } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import UserList from '../components/UserList'
import Layout from './Layout'

const UsersView: FC = () => {
  return (
    <Layout>
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
    </Layout>
  )
}

export default UsersView
