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
import TickerUsersForm from './TickerUsersForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
  users: User[]
}

const TickerUsersModal: FC<Props> = ({ onClose, open, ticker, users }) => {
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
          Manage User Access
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TickerUsersForm
          defaultValue={users.map(user => {
            return user.id
          })}
          onSubmit={handleClose}
          ticker={ticker}
        />
      </DialogContent>
      <DialogActions>
        <Button form="tickerUsersForm" type="submit">
          Save
        </Button>

        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TickerUsersModal
