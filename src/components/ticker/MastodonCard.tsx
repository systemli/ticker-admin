import React, { FC, useCallback, useState } from 'react'
import { faMastodon } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueryClient } from '@tanstack/react-query'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import MastodonModalForm from './MastodonModalForm'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import {
  faBan,
  faGear,
  faPause,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'

interface Props {
  ticker: Ticker
}

const MastodonCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { deleteTickerMastodon, putTickerMastodon } = useTickerApi(token)
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const mastodon = ticker.mastodon

  const handleDisconnect = useCallback(() => {
    deleteTickerMastodon(ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
    })
  }, [deleteTickerMastodon, queryClient, ticker])

  const handleToggle = useCallback(() => {
    putTickerMastodon({ active: !mastodon.active }, ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
    })
  }, [mastodon.active, putTickerMastodon, queryClient, ticker])

  const profileLink = (
    <a
      href={mastodon.server + '/web/@' + mastodon.name}
      rel="noreferrer"
      target="_blank"
    >
      @{mastodon.name}@{mastodon.server.replace(/^https?:\/\//, '')}
    </a>
  )

  return (
    <Card>
      <CardContent>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faMastodon} /> Mastodon
          </Typography>
          <Button
            onClick={() => setOpen(true)}
            size="small"
            startIcon={<FontAwesomeIcon icon={faGear} />}
          >
            Configure
          </Button>
        </Stack>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        {mastodon.connected ? (
          <Box>
            <Typography variant="body2">
              You are connected to Mastodon.
            </Typography>
            <Typography variant="body2">Profile: {profileLink}</Typography>
          </Box>
        ) : (
          <Typography component="p" variant="body2">
            You are currently not connected to Mastodon. New messages will not
            be published to your account and old messages can not be deleted
            anymore.
          </Typography>
        )}
      </CardContent>
      {mastodon.connected ? (
        <CardActions>
          {mastodon.active ? (
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
      <MastodonModalForm
        onClose={() => setOpen(false)}
        open={open}
        ticker={ticker}
      />
    </Card>
  )
}

export default MastodonCard
