import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import TwitterLogin from 'react-twitter-auth'
import { Button, Card, Container, Icon, Image } from 'semantic-ui-react'
import { ApiUrl } from '../../api/Api'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

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
  const { deleteTickerTwitter, putTickerTwitter } = useTickerApi(token)

  const twitter = ticker.twitter || {}
  const requestTokenUrl = `${ApiUrl}/admin/auth/twitter/request_token?callback=${encodeURI(
    window.location.origin
  )}`
  const loginUrl = `${ApiUrl}/admin/auth/twitter`

  const handleToggle = useCallback(() => {
    putTickerTwitter({ active: !twitter.active }, ticker).finally(() =>
      queryClient.invalidateQueries(['ticker', ticker.id])
    )
  }, [putTickerTwitter, twitter.active, ticker, queryClient])

  const handleConnect = useCallback(
    (response: any) => {
      response.json().then((data: TwitterAuthResponseData) => {
        putTickerTwitter(
          {
            active: true,
            token: data.access_token,
            secret: data.access_secret,
          },
          ticker
        ).finally(() => {
          queryClient.invalidateQueries(['ticker', ticker.id])
        })
      })
    },
    [putTickerTwitter, queryClient, ticker]
  )

  const handleDisconnect = useCallback(() => {
    deleteTickerTwitter(ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
    })
  }, [deleteTickerTwitter, queryClient, ticker])

  const alertError = useCallback((error: string) => {
    alert(error)
  }, [])

  return twitter.connected ? (
    <Container>
      <Card fluid>
        <Card.Content>
          {twitter.image_url != '' && (
            <Image floated="right" size="mini" src={twitter.image_url} />
          )}
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
                onClick={handleToggle}
              />
            ) : (
              <Button
                color="green"
                content="Enable"
                icon="play"
                onClick={handleToggle}
              />
            )}
            <Button
              color="red"
              content="Disconnect"
              icon="delete"
              onClick={handleDisconnect}
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
          published to your account and old messages can not be deleted anymore.
        </Card.Content>
        <Card.Content extra>
          <TwitterLogin
            // @ts-ignore
            className="ui button blue tiny compact"
            loginUrl={loginUrl}
            onFailure={alertError}
            onSuccess={handleConnect}
            requestTokenUrl={requestTokenUrl}
            showIcon={false}
          >
            <Icon>
              <FontAwesomeIcon icon={faTwitter} />
            </Icon>
            Connect
          </TwitterLogin>
        </Card.Content>
      </Card>
    </Container>
  )
}

export default TwitterCard
