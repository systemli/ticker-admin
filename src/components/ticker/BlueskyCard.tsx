import { faBluesky } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardActions, CardContent, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback, useState } from 'react'
import { Ticker, deleteTickerBlueskyApi, putTickerBlueskyApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import BlueskyModalForm from './BlueskyModalForm'

interface Props {
  ticker: Ticker
}

const BlueskyCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const bluesky = ticker.bluesky

  const handleDisconnect = useCallback(() => {
    deleteTickerBlueskyApi(token, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
    })
  }, [token, queryClient, ticker])

  const handleToggle = useCallback(() => {
    putTickerBlueskyApi(token, { active: !bluesky.active }, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
    })
  }, [bluesky.active, token, queryClient, ticker])

  const profileLink = (
    <Link href={'https://bsky.app/profile/' + bluesky.handle} rel="noreferrer" target="_blank">
      {bluesky.handle}
    </Link>
  )

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faBluesky} /> Bluesky
          </Typography>
          <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
            Configure
          </Button>
        </Stack>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        {bluesky.connected ? (
          <Box>
            <Typography variant="body2">You are connected with Bluesky.</Typography>
            <Typography variant="body2">Your Profile: {profileLink}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2">You are not connected with Bluesky.</Typography>
            <Typography variant="body2">New messages will not be published to your account and old messages can not be deleted anymore.</Typography>
          </Box>
        )}
      </CardContent>
      {bluesky.connected ? (
        <CardActions>
          {bluesky.active ? (
            <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPause} />}>
              Disable
            </Button>
          ) : (
            <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPlay} />}>
              Enable
            </Button>
          )}
          <Button onClick={handleDisconnect} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            Disconnect
          </Button>
        </CardActions>
      ) : null}
      <BlueskyModalForm open={open} onClose={() => setOpen(false)} ticker={ticker} />
    </Card>
  )
}

export default BlueskyCard
