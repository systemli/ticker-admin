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
import MastodonForm from './MastodonForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const MastodonModalForm: FC<Props> = ({ onClose, open, ticker }) => {
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
          Configure Mastodon
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <MastodonForm callback={handleClose} ticker={ticker} />
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          form="configureMastodon"
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

export default MastodonModalForm
