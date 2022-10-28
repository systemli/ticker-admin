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
import TickerForm from './TickerForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker?: Ticker
}

const TickerModalForm: FC<Props> = ({ onClose, open, ticker }) => {
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
          {ticker ? 'Update Ticker' : 'Create Ticker'}
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TickerForm callback={handleClose} id="tickerForm" ticker={ticker} />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          form="tickerForm"
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

export default TickerModalForm
