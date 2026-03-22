import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons'
import { faPause, faPlay, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerSignalGroupApi, putTickerSignalGroupApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import CopyToClipboard from '../common/CopyToClipboard'
import IntegrationCard, { IntegrationStatus } from './IntegrationCard'
import SignalGroupAdminModalForm from './SignalGroupAdminModalForm'

interface Props {
  ticker: Ticker
}

const SignalGroupCard: FC<Props> = ({ ticker }) => {
  const { t } = useTranslation()
  const { token } = useAuth()
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState<boolean>(false)
  const [adminOpen, setAdminOpen] = useState<boolean>(false)
  const [submittingAdd, setSubmittingAdd] = useState<boolean>(false)
  const [submittingToggle, setSubmittingToggle] = useState<boolean>(false)
  const [submittingDelete, setSubmittingDelete] = useState<boolean>(false)
  const { createNotification } = useNotification()

  const queryClient = useQueryClient()

  const signalGroup = ticker.signalGroup

  const handleAdd = () => {
    setSubmittingAdd(true)

    handleApiCall(putTickerSignalGroupApi(token, { active: true }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t('integrations.signal.enabled'), severity: 'success' })
        setSubmittingAdd(false)
      },
      onError: () => {
        createNotification({ content: t('integrations.signal.errorConfigure'), severity: 'error' })
        setSubmittingAdd(false)
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
        setSubmittingAdd(false)
      },
    })
  }

  const handleToggle = () => {
    setSubmittingToggle(true)

    handleApiCall(putTickerSignalGroupApi(token, { active: !signalGroup.active }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t(signalGroup.active ? 'integrations.signal.disabled' : 'integrations.signal.enabled'), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('integrations.signal.errorUpdate'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })

    setSubmittingToggle(false)
  }

  const handleDelete = () => {
    setSubmittingDelete(true)
    deleteTickerSignalGroupApi(token, ticker)
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t('integrations.signal.deleted'), severity: 'success' })
      })
      .catch(() => {
        createNotification({ content: 'integrations.signal.errorDelete', severity: 'error' })
      })
      .finally(() => {
        setDialogDeleteOpen(false)
        setSubmittingDelete(false)
      })
  }

  const status: IntegrationStatus = signalGroup.connected ? (signalGroup.active ? 'active' : 'inactive') : 'notConfigured'

  const details = signalGroup.connected ? (
    <Stack spacing={1}>
      <div>
        <Typography variant="caption" color="text.secondary">
          {t('integrations.signal.inviteLink')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link href={signalGroup.groupInviteLink} rel="noreferrer" target="_blank" variant="body2">
            {ticker.title}
          </Link>
          <CopyToClipboard text={signalGroup.groupInviteLink} />
        </Stack>
      </div>
    </Stack>
  ) : null

  const actions = signalGroup.connected ? (
    <>
      <Button onClick={() => setAdminOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faPlus} />}>
        {t('common.admin')}
      </Button>
      <Box sx={{ display: 'inline', position: 'relative' }}>
        {signalGroup.active ? (
          <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPause} />} disabled={submittingToggle}>
            {t('action.disable')}
          </Button>
        ) : (
          <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPlay} />} disabled={submittingToggle}>
            {t('action.enable')}
          </Button>
        )}
        {submittingToggle && (
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
      <Button onClick={() => setDialogDeleteOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
        {t('action.delete')}
      </Button>
    </>
  ) : (
    <Box sx={{ display: 'inline', position: 'relative' }}>
      <Button onClick={handleAdd} size="small" startIcon={<FontAwesomeIcon icon={faPlus} />} disabled={submittingAdd}>
        {t('action.add')}
      </Button>
      {submittingAdd && (
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
  )

  return (
    <IntegrationCard
      icon={faSignalMessenger}
      title={t('integrations.signal.title')}
      description={t('integrations.signal.description')}
      status={status}
      details={details}
      actions={actions}
    >
      <SignalGroupAdminModalForm open={adminOpen} onClose={() => setAdminOpen(false)} ticker={ticker} />
      <Dialog open={dialogDeleteOpen} onClose={() => setDialogDeleteOpen(false)}>
        <DialogTitle>{t('integrations.signal.delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('integrations.signal.questionDelete')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDeleteOpen(false)}>{t('action.cancel')}</Button>
          <Box sx={{ display: 'inline', position: 'relative' }}>
            <Button onClick={handleDelete} color="error" disabled={submittingDelete} data-testid="dialog-delete">
              {t('action.delete')}
            </Button>
            {submittingDelete && (
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
        </DialogActions>
      </Dialog>
    </IntegrationCard>
  )
}

export default SignalGroupCard
