import React, { FC } from 'react'
import { Close } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material'
import { User } from '../../api/User'
import UserForm from './UserForm'

interface Props {
  onClose: () => void
  open: boolean
  user?: User
}

const UserModalForm: FC<Props> = ({ open, onClose, user }) => {
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          {user ? 'Update User' : 'Create User'}
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <UserForm callback={handleClose} id="userForm" user={user} />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          form="userForm"
          type="submit"
          variant="contained"
        >
          Save
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserModalForm
