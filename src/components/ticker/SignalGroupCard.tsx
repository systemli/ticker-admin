import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons'
import { faAdd, faPause, faPlay, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
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
import { FC, useState } from 'react'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerSignalGroupApi, putTickerSignalGroupApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import SignalGroupAdminModalForm from './SignalGroupAdminModalForm'

interface Props {
  ticker: Ticker
}

const SignalGroupCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState<boolean>(false)
  const [adminOpen, setAdminOpen] = useState<boolean>(false)
  const [submittingAdd, setSubmittingAdd] = useState<boolean>(false)
  const [submittingToggle, setSubmittingToggle] = useState<boolean>(false)
  const [submittingDelete, setSubmittingDelete] = useState<boolean>(false)
  const { createNotification } = useNotification()

  const queryClient = useQueryClient()

  const signalGroup = ticker.signalGroup

  const handleAdd = () => {
    setSubmittingAdd(true)

    handleApiCall(putTickerSignalGroupApi(token, { active: true }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: 'Signal Group enabled successfully', severity: 'success' })
        setSubmittingAdd(false)
      },
      onError: () => {
        createNotification({ content: 'Failed to configure Signal group', severity: 'error' })
        setSubmittingAdd(false)
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
        setSubmittingAdd(false)
      },
    })
  }

  const handleToggle = () => {
    setSubmittingToggle(true)

    handleApiCall(putTickerSignalGroupApi(token, { active: !signalGroup.active }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: `Signal group ${signalGroup.active ? 'disabled' : 'enabled'} successfully`, severity: 'success' })
      },
      onError: () => {
        createNotification({ content: 'Failed to update Signal group', severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })

    setSubmittingToggle(false)
  }

  const handleDelete = () => {
    setSubmittingDelete(true)
    deleteTickerSignalGroupApi(token, ticker)
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: 'Signal Group deleted successfully', severity: 'success' })
      })
      .catch(() => {
        createNotification({ content: 'Failed to delete Signal group', severity: 'error' })
      })
      .finally(() => {
        setDialogDeleteOpen(false)
        setSubmittingDelete(false)
      })
  }

  const groupLink = (
    <Link href={signalGroup.groupInviteLink} rel="noreferrer" target="_blank">
      {ticker.title}
    </Link>
  )

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faSignalMessenger} /> Signal Group
          </Typography>
          {signalGroup.connected ? null : (
            <Box sx={{ display: 'inline', position: 'relative' }}>
              <Button onClick={handleAdd} size="small" startIcon={<FontAwesomeIcon icon={faAdd} />} disabled={submittingAdd}>
                Add
              </Button>
              {submittingAdd && (
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
          )}
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
          <Box sx={{ display: 'inline', position: 'relative' }}>
            {signalGroup.active ? (
              <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPause} />} disabled={submittingToggle}>
                Disable
              </Button>
            ) : (
              <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPlay} />} disabled={submittingToggle}>
                Enable
              </Button>
            )}
            {submittingToggle && (
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
          <Button onClick={() => setDialogDeleteOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            Delete
          </Button>
        </CardActions>
      ) : null}
      <SignalGroupAdminModalForm open={adminOpen} onClose={() => setAdminOpen(false)} ticker={ticker} />
      <Dialog open={dialogDeleteOpen}>
        <DialogTitle>Delete Signal Group</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete the Signal group? This is irreversible.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDeleteOpen(false)}>Cancel</Button>
          <Box sx={{ display: 'inline', position: 'relative' }}>
            <Button onClick={handleDelete} color="error" disabled={submittingDelete} data-testid="dialog-delete">
              Delete
            </Button>
            {submittingDelete && (
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
