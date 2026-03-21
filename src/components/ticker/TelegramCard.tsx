import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faCircleInfo, faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, CardActions, CardContent, Chip, Divider, Link, Stack, Tooltip, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerTelegramApi, putTickerTelegramApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import CopyToClipboard from '../common/CopyToClipboard'
import TelegramModalForm from './TelegramModalForm'

interface Props {
  ticker: Ticker
}

const TelegramCard: FC<Props> = ({ ticker }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const telegram = ticker.telegram

  const handleToggle = () => {
    handleApiCall(putTickerTelegramApi(token, { active: !telegram.active }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t(telegram.active ? 'integrations.telegram.disabled' : 'integrations.telegram.enabled'), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('integrations.telegram.errorUpdate'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const handleDelete = () => {
    handleApiCall(deleteTickerTelegramApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t('integrations.telegram.deleted'), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('integrations.telegram.errorDelete'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const channelUrl = `https://t.me/${telegram.channelName}`

  const statusChip = telegram.connected ? (
    telegram.active ? (
      <Chip label={t('integrations.integrationStatus.active')} color="success" size="small" variant="outlined" />
    ) : (
      <Chip label={t('integrations.integrationStatus.inactive')} color="warning" size="small" variant="outlined" />
    )
  ) : (
    <Chip label={t('integrations.integrationStatus.notConfigured')} size="small" variant="outlined" />
  )

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1}>
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faTelegram} /> {t('integrations.telegram.title')}
          </Typography>
          {statusChip}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('integrations.telegram.description')}
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardContent sx={{ flexGrow: 1 }}>
        {telegram.connected ? (
          <Stack spacing={1}>
            <div>
              <Typography variant="caption" color="text.secondary">
                {t('integrations.telegram.channel')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Link href={channelUrl} rel="noreferrer" target="_blank" variant="body2">
                  {telegram.channelName}
                </Link>
                <CopyToClipboard text={channelUrl} />
              </Stack>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                {t('integrations.telegram.botLabel')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="body2">{telegram.botUsername}</Typography>
                <Tooltip title={t('integrations.telegram.botHint')}>
                  <FontAwesomeIcon icon={faCircleInfo} size="sm" style={{ color: 'gray', cursor: 'help' }} />
                </Tooltip>
              </Stack>
            </div>
          </Stack>
        ) : (
          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
            {t('integrations.notConfiguredHint')}
          </Typography>
        )}
      </CardContent>
      <Divider variant="middle" />
      <CardActions>
        {telegram.connected ? (
          <>
            {telegram.active ? (
              <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPause} />}>
                {t('action.disable')}
              </Button>
            ) : (
              <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPlay} />}>
                {t('action.enable')}
              </Button>
            )}
          </>
        ) : null}
        <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
          {t('action.configure')}
        </Button>
        {telegram.connected ? (
          <Button onClick={handleDelete} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            {t('action.delete')}
          </Button>
        ) : null}
      </CardActions>
      <TelegramModalForm onClose={() => setOpen(false)} open={open} ticker={ticker} />
    </Card>
  )
}

export default TelegramCard
