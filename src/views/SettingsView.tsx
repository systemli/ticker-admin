import React, { FC } from 'react'
import { Container, Grid, Header } from 'semantic-ui-react'
import Navigation from './Navigation'
import RefreshIntervalCard from '../components/RefreshIntervalCard'
import InactiveSettingsCard from '../components/InactiveSettingsCard'

const SettingsView: FC = () => {
  return (
    <Container>
      <Navigation />
      <Container className="app">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header dividing>Settings</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={4}>
            <Grid.Column>
              <InactiveSettingsCard />
            </Grid.Column>
            <Grid.Column>
              <RefreshIntervalCard />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Container>
  )
}

export default SettingsView
