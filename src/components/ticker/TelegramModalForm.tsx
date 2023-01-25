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
import { Ticker } from '../../api/Ticker'
import TelegramForm from './TelegramForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TelegramModalForm: FC<Props> = ({ onClose, open, ticker }) => {
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
          Configure Telegram
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TelegramForm callback={handleClose} ticker={ticker} />
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          form="configureTelegram"
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

export default TelegramModalForm
