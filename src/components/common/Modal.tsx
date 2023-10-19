import React, { FC, ReactNode } from 'react'
import { Breakpoint, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, SxProps } from '@mui/material'
import { Close } from '@mui/icons-material'

interface Props {
  children: ReactNode
  dangerActionButtonText?: string
  dialogContentSx?: SxProps
  fullWidth?: boolean
  maxWidth?: Breakpoint
  onClose: () => void
  onDangerAction?: () => void
  onSubmitAction?: () => void
  open: boolean
  submitForm?: string
  title?: string
}

const Modal: FC<Props> = ({
  children,
  dangerActionButtonText,
  dialogContentSx,
  fullWidth,
  maxWidth = 'md',
  onClose,
  onDangerAction,
  onSubmitAction,
  open,
  submitForm,
  title,
}) => {
  return (
    <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open}>
      <DialogTitle>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          {title}
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={dialogContentSx}>{children}</DialogContent>
      <DialogActions>
        {submitForm && (
          <Button color="primary" form={submitForm} onClick={onSubmitAction} type="submit" variant="contained">
            Save
          </Button>
        )}
        {onDangerAction && dangerActionButtonText && (
          <Button color="error" onClick={onDangerAction} variant="contained">
            {dangerActionButtonText}
          </Button>
        )}
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Modal
