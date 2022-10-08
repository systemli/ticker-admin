import React, { FC } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import RefreshIntervalCard from '../components/settings/RefreshIntervalCard'
import InactiveSettingsCard from '../components/settings/InactiveSettingsCard'
import Layout from './Layout'

const SettingsView: FC = () => {
  return (
    <Layout>
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
    </Layout>
  )
}

export default SettingsView
