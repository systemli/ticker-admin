import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import TwitterLogin from 'react-twitter-auth'
import { Button, Card, Container, Icon } from 'semantic-ui-react'
import { ApiUrl } from '../api/Api'
import { Ticker, useTickerApi } from '../api/Ticker'
import useAuth from './useAuth'

interface Props {
  ticker: Ticker
}

interface TwitterAuthResponseData {
  access_secret: string
  access_token: string
}

const TwitterCard: FC<Props> = ({ ticker }) => {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const { putTickerTwitter } = useTickerApi(token)

  const twitter = ticker.twitter || {}
  const requestTokenUrl = `${ApiUrl}/admin/auth/twitter/request_token?callback=${encodeURI(
    window.location.origin
  )}`
  const loginUrl = `${ApiUrl}/admin/auth/twitter`

  const updateTickerTwitter = useCallback(
    (active: boolean, token = '', secret = '', disconnect = false) => {
      const formData = {
        active,
        disconnect,
        token,
        secret,
      }

      putTickerTwitter(formData, ticker).then(() =>
        queryClient.invalidateQueries(['ticker', ticker.id])
      )
    },
    [ticker, putTickerTwitter, queryClient]
  )

  const toggleActive = useCallback(() => {
    updateTickerTwitter(!twitter.active)
  }, [twitter.active, updateTickerTwitter])

  const connect = useCallback(
    (response: any) => {
      response.json().then((data: TwitterAuthResponseData) => {
        updateTickerTwitter(true, data.access_token, data.access_secret)
      })
    },
    [updateTickerTwitter]
  )

  const disconnect = useCallback(() => {
    updateTickerTwitter(false, '', '', true)
  }, [updateTickerTwitter])

  const alertError = useCallback((error: string) => {
    alert(error)
  }, [])

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
          <Button.Group compact size="tiny">
            {twitter.active ? (
              <Button
                color="yellow"
                content="Disable"
                icon="pause"
                onClick={toggleActive}
              />
            ) : (
              <Button
                color="green"
                content="Enable"
                icon="play"
                onClick={toggleActive}
              />
            )}
            <Button
              color="red"
              content="Disconnect"
              icon="delete"
              onClick={disconnect}
            />
          </Button.Group>
        </Card.Content>
      </Card>
    </Container>
  ) : (
    <Container>
      <Card fluid>
        <Card.Content>
          You are currently not connected to Twitter. New messages will not be
          published to your account.
        </Card.Content>
        <Card.Content extra>
          <TwitterLogin
            // @ts-ignore
            className="ui button blue tiny compact"
            loginUrl={loginUrl}
            onFailure={alertError}
            onSuccess={connect}
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

export default TwitterCard
