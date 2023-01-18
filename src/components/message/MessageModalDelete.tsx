import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Message, useMessageApi } from '../../api/Message'
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
  onClose: () => void
  open: boolean
  message: Message
}
const MessageModalDelete: FC<Props> = ({ message, onClose, open }) => {
  const { token } = useAuth()
  const { deleteMessage } = useMessageApi(token)
  const queryClient = useQueryClient()

  const handleClose = () => {
    onClose()
  }

  const handleDelete = useCallback(() => {
    deleteMessage(message).then(() => {
      queryClient.invalidateQueries(['messages', message.ticker])
      onClose()
    })
  }, [deleteMessage, message, onClose, queryClient])

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          Delete Message
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        Are you sure to delete the message? This action cannot be undone.
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

export default MessageModalDelete
