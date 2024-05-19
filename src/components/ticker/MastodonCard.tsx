import { faMastodon } from '@fortawesome/free-brands-svg-icons'
import { faBan, faGear, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardActions, CardContent, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback, useState } from 'react'
import { Ticker, deleteTickerMastodonApi, putTickerMastodonApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import MastodonModalForm from './MastodonModalForm'

interface Props {
  ticker: Ticker
}

const MastodonCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const mastodon = ticker.mastodon

  const handleDisconnect = useCallback(() => {
    deleteTickerMastodonApi(token, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
    })
  }, [token, queryClient, ticker])

  const handleToggle = useCallback(() => {
    putTickerMastodonApi(token, { active: !mastodon.active }, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
    })
  }, [mastodon.active, token, queryClient, ticker])

  const profileLink = (
    <Link href={mastodon.server + '/web/@' + mastodon.name} rel="noreferrer" target="_blank">
      @{mastodon.name}@{mastodon.server.replace(/^https?:\/\//, '')}
    </Link>
  )

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faMastodon} /> Mastodon
          </Typography>
          <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
            Configure
          </Button>
        </Stack>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        {mastodon.connected ? (
          <Box>
            <Typography variant="body2">You are connected with Mastodon.</Typography>
            <Typography variant="body2">Your Profile: {profileLink}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography component="p" variant="body2">
              You are not connected with Mastodon.
            </Typography>
            <Typography component="p" variant="body2">
              New messages will not be published to your account and old messages can not be deleted anymore.
            </Typography>
          </Box>
        )}
      </CardContent>
      {mastodon.connected ? (
        <CardActions>
          {mastodon.active ? (
            <Button onClick={handleToggle} startIcon={<FontAwesomeIcon icon={faPause} />}>
              Disable
            </Button>
          ) : (
            <Button onClick={handleToggle} startIcon={<FontAwesomeIcon icon={faPlay} />}>
              Enable
            </Button>
          )}
          <Button onClick={handleDisconnect} startIcon={<FontAwesomeIcon icon={faBan} />}>
            Disconnect
          </Button>
        </CardActions>
      ) : null}
      <MastodonModalForm onClose={() => setOpen(false)} open={open} ticker={ticker} />
    </Card>
  )
}

export default MastodonCard
