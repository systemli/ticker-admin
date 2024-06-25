import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback, useState } from 'react'
import { Ticker, deleteTickerSignalGroupApi, putTickerSignalGroupApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import SignalGroupAdminModalForm from './SignalGroupAdminModalForm'
import SignalGroupModalForm from './SignalGroupModalForm'

interface Props {
  ticker: Ticker
}

const SignalGroupCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState<boolean>(false)
  const [adminOpen, setAdminOpen] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { createNotification } = useNotification()

  const queryClient = useQueryClient()

  const signalGroup = ticker.signalGroup

  const handleToggle = useCallback(() => {
    putTickerSignalGroupApi(token, { active: !signalGroup.active }, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
    })
  }, [token, queryClient, signalGroup.active, ticker])

  const handleDelete = () => {
    setSubmitting(true)
    deleteTickerSignalGroupApi(token, ticker)
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: 'Signal group deleted successfully', severity: 'success' })
      })
      .catch(() => {
        createNotification({ content: 'Failed to delete Signal group', severity: 'error' })
      })
      .finally(() => {
        setDialogDeleteOpen(false)
        setSubmitting(false)
      })
  }

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
          <Button onClick={() => setDialogDeleteOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            Delete
          </Button>
        </CardActions>
      ) : null}
      <SignalGroupModalForm open={open} onClose={() => setOpen(false)} ticker={ticker} />
      <SignalGroupAdminModalForm open={adminOpen} onClose={() => setAdminOpen(false)} ticker={ticker} />
      <Dialog open={dialogDeleteOpen}>
        <DialogTitle>Delete Signal Group</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete the Signal group? This is irreversible.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDeleteOpen(false)}>Cancel</Button>
          <Box sx={{ display: 'inline', position: 'relative' }}>
            <Button onClick={handleDelete} color="error" disabled={submitting}>
              Delete
            </Button>
            {submitting && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default SignalGroupCard
