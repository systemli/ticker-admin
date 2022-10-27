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
import { InactiveSetting, Setting } from '../../api/Settings'
import InactiveSettingsForm from './InactiveSettingsForm'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<InactiveSetting>
}

const InactiveSettingsModalForm: FC<Props> = ({ open, onClose, setting }) => {
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
          Edit Inactive Settings
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <InactiveSettingsForm
          callback={handleClose}
          name="inactiveSettingForm"
          setting={setting}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          form="inactiveSettingForm"
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

export default InactiveSettingsModalForm
