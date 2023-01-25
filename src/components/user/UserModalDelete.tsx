import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { User, useUserApi } from '../../api/User'
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
  user: User
}

const UserModalDelete: FC<Props> = ({ onClose, open, user }) => {
  const { token } = useAuth()
  const { deleteUser } = useUserApi(token)
  const queryClient = useQueryClient()

  const handleClose = () => {
    onClose()
  }

  const handleDelete = useCallback(() => {
    deleteUser(user).finally(() => {
      queryClient.invalidateQueries(['users'])
      onClose()
    })
  }, [deleteUser, user, queryClient, onClose])

  return (
    <Dialog maxWidth="md" open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          Delete User
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        Are you sure to delete the user? This action cannot be undone.
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

export default UserModalDelete
