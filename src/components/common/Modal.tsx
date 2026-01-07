import { Close } from '@mui/icons-material'
import { Box, Breakpoint, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, SxProps } from '@mui/material'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

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
  submitting?: boolean
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
  submitting = false,
  title,
}) => {
  const { t } = useTranslation()
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
          <Box sx={{ display: 'inline', position: 'relative' }}>
            <Button color="primary" form={submitForm} onClick={onSubmitAction} type="submit" variant="contained" disabled={submitting}>
              {t('action.save')}
            </Button>
            {submitting && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        )}
        {onDangerAction && dangerActionButtonText && (
          <Button color="error" onClick={onDangerAction} variant="contained">
            {dangerActionButtonText}
          </Button>
        )}
        <Button color="secondary" onClick={onClose}>
          {t('action.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Modal
