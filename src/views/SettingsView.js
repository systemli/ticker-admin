import React from 'react'
import { Container, Grid, Header } from 'semantic-ui-react'
import Navigation from './Navigation'
import InactiveSettings from '../components/InactiveSettings'
import RefreshInterval from '../components/RefreshInterval'
import PropTypes from 'prop-types'
import withAuth from '../components/withAuth'

class SettingsView extends React.Component {
  render() {
    return (
      <Container>
        <Navigation history={this.props.history} user={this.props.user} />
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
}

export default withAuth(SettingsView)

SettingsView.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}
