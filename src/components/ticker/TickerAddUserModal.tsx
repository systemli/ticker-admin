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
import React, { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import TickerAddUserForm from './TickerAddUserForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
  users: User[]
}

const TickerAddUserModal: FC<Props> = ({ onClose, open, ticker, users }) => {
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          Add Users
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TickerAddUserForm
          onSubmit={handleClose}
          ticker={ticker}
          users={users}
        />
      </DialogContent>
      <DialogActions>
        <Button form="tickerUsersForm" type="submit">
          Add
        </Button>

        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TickerAddUserModal
