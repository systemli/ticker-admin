import { Close } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import { Stack } from '@mui/system'
import React, { FC } from 'react'
import { Setting } from '../../api/Settings'
import RefreshIntervalForm from './RefreshIntervalForm'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<string>
}

const RefreshIntervalModalForm: FC<Props> = ({ open, onClose, setting }) => {
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
          Edit Refresh Interval
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <RefreshIntervalForm
          callback={handleClose}
          name="refreshIntervalForm"
          setting={setting}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          form="refreshIntervalForm"
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

export default RefreshIntervalModalForm
