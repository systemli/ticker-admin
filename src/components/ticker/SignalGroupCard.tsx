import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardActions, CardContent, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback, useState } from 'react'
import { Ticker, deleteTickerSignalGroupApi, putTickerSignalGroupApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import SignalGroupAdminModalForm from './SignalGroupAdminModalForm'
import SignalGroupModalForm from './SignalGroupModalForm'

interface Props {
  ticker: Ticker
}

const SignalGroupCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const [adminOpen, setAdminOpen] = useState<boolean>(false)

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
            <Typography variant="body2">You have a Signal group connected.</Typography>
            <Typography variant="body2">Your Signal group invite link: {groupLink}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2">You don't have a Signal group connected.</Typography>
            <Typography variant="body2">New messages will not be published to a group and old messages can not be deleted.</Typography>
          </Box>
        )}
      </CardContent>
      {signalGroup.connected ? (
        <CardActions>
          <Button onClick={() => setAdminOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faPlus} />}>
            Admin
          </Button>
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
      <SignalGroupAdminModalForm open={adminOpen} onClose={() => setAdminOpen(false)} ticker={ticker} />
    </Card>
  )
}

export default SignalGroupCard
