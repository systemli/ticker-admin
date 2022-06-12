import React, { FC } from 'react'
import { Container, Grid, Header } from 'semantic-ui-react'
import Navigation from './Navigation'
import InactiveSettings from '../components/InactiveSettings'
import RefreshInterval from '../components/RefreshInterval'
import withAuth from '../components/withAuth'

interface Props {
  user: any
}

const SettingsView: FC<Props> = props => {
  return (
    <Container>
      <Navigation user={props.user} />
      <Container className="app">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header dividing>Settings</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={4}>
            <Grid.Column>
              <InactiveSettings />
            </Grid.Column>
            <Grid.Column>
              <RefreshInterval />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Container>
  )
}

export default withAuth(SettingsView)
