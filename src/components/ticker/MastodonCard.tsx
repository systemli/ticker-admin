import React, { FC, useCallback } from 'react'
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
  Stack,
  Typography,
} from '@mui/material'

interface Props {
  ticker: Ticker
}

const MastodonCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { deleteTickerMastodon, putTickerMastodon } = useTickerApi(token)
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

  return mastodon.connected ? (
    <Box>
      <Stack>
        <Typography component="h5" variant="h5">
          Mastodon
        </Typography>
        <Button
          size="small"
          startIcon={<FontAwesomeIcon icon={faMastodon} />}
          variant="outlined"
        >
          Configure
        </Button>
      </Stack>
    </Box>
  ) : (
    <Card>
      <CardContent>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Typography component="h5" variant="h5">
            Mastodon
          </Typography>
          <Button
            size="small"
            startIcon={<FontAwesomeIcon icon={faMastodon} />}
            variant="outlined"
          >
            Configure
          </Button>
        </Stack>
        <Typography component="p" variant="body2">
          You are currently not connected to Mastodon. New messages will not be
          published to your account and old messages can not be deleted anymore.
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  )
}

export default MastodonCard
