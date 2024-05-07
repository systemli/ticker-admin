import { Box, Button, Card, CardActions, CardContent, Divider, Link, Stack, Typography } from '@mui/material'
import { Ticker, putTickerSignalGroupApi, deleteTickerSignalGroupApi } from '../../api/Ticker'
import { FC, useCallback, useState } from 'react'
import useAuth from '../../contexts/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import SignalGroupModalForm from './SignalGroupModalForm'

interface Props {
  ticker: Ticker
}

const SignalGroupCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const signalGroup = ticker.signalGroup

  const handleToggle = useCallback(() => {
    putTickerSignalGroupApi(token, { active: !signalGroup.active }, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
    })
  }, [token, queryClient, signalGroup.active, ticker])

  const handleDisconnect = useCallback(() => {
    deleteTickerSignalGroupApi(token, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
    })
  }, [token, queryClient, ticker])

  const groupLink = (
    <Link href={signalGroup.groupInviteLink} rel="noreferrer" target="_blank">
      {signalGroup.groupName}
    </Link>
  )

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faSignalMessenger} /> Signal Group
          </Typography>
          <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
            Configure
          </Button>
        </Stack>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        {signalGroup.connected ? (
          <Box>
            <Typography variant="body2">You are connected with the Signal group.</Typography>
            <Typography variant="body2">Your Signal group invite link: {groupLink}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2">You are not connected with the Signal group.</Typography>
            <Typography variant="body2">New messages will not be published to the group and old messages can not be deleted anymore.</Typography>
          </Box>
        )}
      </CardContent>
      {signalGroup.connected ? (
        <CardActions>
          {signalGroup.active ? (
            <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPause} />}>
              Pause
            </Button>
          ) : (
            <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPlay} />}>
              Enable
            </Button>
          )}
          <Button onClick={handleDisconnect} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            Delete group
          </Button>
        </CardActions>
      ) : null}
      <SignalGroupModalForm open={open} onClose={() => setOpen(false)} ticker={ticker} />
    </Card>
  )
}

export default SignalGroupCard
