import React from 'react'
import PropTypes from 'prop-types'
import { ApiUrl } from '../api/Api'
import { Button, Card, Container, Icon } from 'semantic-ui-react'
import TwitterLogin from 'react-twitter-auth'
import { putTickerTwitter } from '../api/Ticker'

export default class TwitterCard extends React.Component {
  constructor(props) {
    super(props)
  }

  disconnect() {
    this.update(false, '', '', true)
  }

  connect(response) {
    response.json().then(data => {
      this.update(true, data.access_token, data.access_secret)
    })
  }

  toggle() {
    const twitter = this.props.ticker.twitter
    this.update(!twitter.active)
  }

  update(active, token, secret, disconnect) {
    let formData = {
      active: active,
      disconnect: disconnect || false,
      token: token || '',
      secret: secret || '',
    }

    putTickerTwitter(formData, this.props.ticker.id).then(response => {
      this.props.callback(response.data.ticker)
    })
  }

  render() {
    const loginUrl = `${ApiUrl}/admin/auth/twitter`
    const requestTokenUrl = `${ApiUrl}/admin/auth/twitter/request_token?callback=${encodeURI(
      window.location.origin
    )}`
    const twitter = this.props.ticker.twitter || {}

    let toggleButton
    if (twitter.active) {
      toggleButton = (
        <Button color="yellow" onClick={this.toggle.bind(this)}>
          <Icon name="pause" /> Disable
        </Button>
      )
    } else {
      toggleButton = (
        <Button color="green" onClick={this.toggle.bind(this)}>
          <Icon name="play" /> Enable
        </Button>
      )
    }

    return twitter.connected ? (
      <Container>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              <Icon
                color={twitter.active ? 'green' : 'red'}
                name={twitter.active ? 'toggle on' : 'toggle off'}
              />
              {twitter.name}
            </Card.Header>
            <Card.Meta>
              <a
                href={'https://twitter.com/' + twitter.screen_name}
                rel="noopener noreferrer"
                target="_blank"
              >
                @{twitter.screen_name}
              </a>
            </Card.Meta>
            <Card.Description>{twitter.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button.Group compact fluid size="tiny">
              {toggleButton}
              <Button color="red" onClick={this.disconnect.bind(this)}>
                <Icon name="delete" />
                Disconnect
              </Button>
            </Button.Group>
          </Card.Content>
        </Card>
      </Container>
    ) : (
      <Container>
        <Card fluid>
          <Card.Content>
            You&lsquo;re currently not connected with Twitter. New messages will
            not be published to your account.
          </Card.Content>
          <Card.Content extra>
            <TwitterLogin
              className="ui button blue tiny compact"
              loginUrl={loginUrl}
              onFailure={error => {
                alert(error)
              }}
              onSuccess={this.connect.bind(this)}
              requestTokenUrl={requestTokenUrl}
              showIcon={false}
            >
              <Icon name="twitter" />
              Connect
            </TwitterLogin>
          </Card.Content>
        </Card>
      </Container>
    )
  }
}

TwitterCard.propTypes = {
  ticker: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
}
