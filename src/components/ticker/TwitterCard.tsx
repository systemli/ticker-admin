import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import TwitterLogin from 'react-twitter-auth'
import { ApiUrl } from '../../api/Api'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Icon,
  Stack,
  Typography,
} from '@mui/material'
import { faBan, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

interface Props {
  ticker: Ticker
}

interface TwitterAuthResponseData {
  access_secret: string
  access_token: string
}

const TwitterCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { deleteTickerTwitter, putTickerTwitter } = useTickerApi(token)
  const queryClient = useQueryClient()

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

  return (
    <Card>
      <CardContent>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faTwitter} /> Twitter
          </Typography>
          {twitter.connected === false ? (
            //TODO: Reimplement and remove the dependency
            <TwitterLogin
              // @ts-ignore
              loginUrl={loginUrl}
              onFailure={alertError}
              onSuccess={handleConnect}
              requestTokenUrl={requestTokenUrl}
              showIcon={false}
              text="Connect"
            >
              <Icon>
                <FontAwesomeIcon icon={faTwitter} />
              </Icon>
              Connect
            </TwitterLogin>
          ) : null}
        </Stack>
        {twitter.connected ? (
          <Box>
            <Typography>
              <a
                href={'https://twitter.com/' + twitter.screen_name}
                rel="noopener noreferrer"
                target="_blank"
              >
                @{twitter.screen_name}
              </a>
            </Typography>
            <Typography>{twitter.description}</Typography>
          </Box>
        ) : (
          <>
            You are currently not connected to Twitter. New messages will not be
            published to your account and old messages can not be deleted
            anymore.
          </>
        )}
      </CardContent>
      {twitter.connected ? (
        <CardActions>
          {twitter.active ? (
            <Button
              onClick={handleToggle}
              startIcon={<FontAwesomeIcon icon={faPause} />}
            >
              Disable
            </Button>
          ) : (
            <Button
              onClick={handleToggle}
              startIcon={<FontAwesomeIcon icon={faPlay} />}
            >
              Enable
            </Button>
          )}
          <Button
            onClick={handleDisconnect}
            startIcon={<FontAwesomeIcon icon={faBan} />}
          >
            Disconnect
          </Button>
        </CardActions>
      ) : null}
    </Card>
  )
}

export default TwitterCard
