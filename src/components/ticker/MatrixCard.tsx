import { faAdd, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
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
import { Ticker, deleteTickerMatrixApi, putTickerMatrixApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  ticker: Ticker
}

const MatrixCard: FC<Props> = ({ ticker }) => {
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState<boolean>(false)
  const [submittingAdd, setSubmittingAdd] = useState<boolean>(false)
  const [submittingToggle, setSubmittingToggle] = useState<boolean>(false)
  const [submittingDelete, setSubmittingDelete] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const matrix = ticker.matrix

  const handleAdd = () => {
    setSubmittingAdd(true)

    handleApiCall(putTickerMatrixApi(token, { active: true }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: 'Matrix created successfully', severity: 'success' })
        setSubmittingAdd(false)
      },
      onError: () => {
        createNotification({ content: 'Failed to create Matrix', severity: 'error' })
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

    handleApiCall(putTickerMatrixApi(token, { active: !matrix.active }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: `Matrix integration ${matrix.active ? 'disabled' : 'enabled'} successfully`, severity: 'success' })
      },
      onError: () => {
        createNotification({ content: 'Failed to update Matrix integration', severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })

    setSubmittingToggle(false)
  }

  const handleDelete = () => {
    setSubmittingDelete(true)
    deleteTickerMatrixApi(token, ticker)
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: 'Matrix integration deleted successfully', severity: 'success' })
      })
      .catch(() => {
        createNotification({ content: 'Failed to delete Matrix integration', severity: 'error' })
      })
      .finally(() => {
        setDialogDeleteOpen(false)
        setSubmittingDelete(false)
      })
  }

  const roomLink = matrix.roomName && (
    <Link href={`https://matrix.to/#/${matrix.roomName}`} rel="noreferrer" target="_blank">
      {matrix.roomName}
    </Link>
  )

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            Matrix
          </Typography>
          {matrix.connected ? null : (
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
        {matrix.connected ? (
          <Box>
            <Typography variant="body2">You are connected with Matrix.</Typography>
            {roomLink && <Typography variant="body2">Your Room: {roomLink}</Typography>}
          </Box>
        ) : (
          <Box>
            <Typography variant="body2">You are not connected with Matrix.</Typography>
            <Typography variant="body2">New messages will not be published to your room and old messages can not be deleted anymore.</Typography>
          </Box>
        )}
      </CardContent>
      {matrix.connected ? (
        <CardActions>
          <Box sx={{ display: 'inline', position: 'relative' }}>
            {matrix.active ? (
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
      <Dialog open={dialogDeleteOpen}>
        <DialogTitle>Delete Matrix integration</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete the Matrix integration? This is irreversible.</DialogContentText>
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

export default MatrixCard
