import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Ticker, useTickerApi } from '../../api/Ticker'
import { User } from '../../api/User'
import useAuth from '../useAuth'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material'
import { Close } from '@mui/icons-material'

interface Props {
  ticker: Ticker
  user: User
  open: boolean
  onClose: () => void
}

const TickerUserModalDelete: FC<Props> = ({ open, onClose, ticker, user }) => {
  const { token } = useAuth()
  const { deleteTickerUser } = useTickerApi(token)
  const queryClient = useQueryClient()

  const handleClose = () => {
    onClose()
  }

  const handleDelete = useCallback(() => {
    deleteTickerUser(ticker, user).finally(() => {
      queryClient.invalidateQueries(['tickerUsers', ticker.id])
      onClose()
    })
  }, [deleteTickerUser, ticker, user, queryClient, onClose])

  return (
    <Dialog maxWidth="md" open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          Delete User from Ticker
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        Are you sure to remove <strong>{user.email}</strong> from this ticker?
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleDelete} variant="contained">
          Delete
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TickerUserModalDelete
