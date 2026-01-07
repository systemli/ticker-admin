import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardActions, CardContent, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerTelegramApi, putTickerTelegramApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import TelegramModalForm from './TelegramModalForm'
import { useTranslation } from 'react-i18next'

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
        createNotification({ content: t(telegram.active ? "integrations.telegram.disabled" : "integrations.telegram.enabled"), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t("integrations.telegram.errorUpdate"), severity: 'error' })
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
        createNotification({ content: t("integrations.telegram.deleted"), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t("integrations.telegram.errorDelete"), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const channelLink = (
    <Link href={`https://t.me/${telegram.channelName}`} rel="noreferrer" target="_blank">
      {telegram.channelName}
    </Link>
  )

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faTelegram} /> {t('integrations.telegram.title')}
          </Typography>
          <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
            {t('action.configure')}
          </Button>
        </Stack>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        {telegram.connected ? (
          <Box>
            <Typography variant="body2">{t('integrations.telegram.connected')}</Typography>
            <Typography variant="body2">{t('integrations.telegram.yourChannel')} {channelLink} {t("integrations.telegram.bot", {bot: telegram.botUsername})}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2">{t('integrations.telegram.notConnected')}</Typography>
            <Typography variant="body2">{t('integrations.noNewMessages', { type: t('common.channel') })}</Typography>
          </Box>
        )}
      </CardContent>
      {telegram.connected ? (
        <CardActions>
          {telegram.active ? (
            <Button onClick={handleToggle} startIcon={<FontAwesomeIcon icon={faPause} />}>
              {t('action.disable')}
            </Button>
          ) : (
            <Button onClick={handleToggle} startIcon={<FontAwesomeIcon icon={faPlay} />}>
              {t('action.enable')}
            </Button>
          )}
          <Button onClick={handleDelete} startIcon={<FontAwesomeIcon icon={faTrash} />}>
            {t('action.delete')}
          </Button>
        </CardActions>
      ) : null}
      <TelegramModalForm onClose={() => setOpen(false)} open={open} ticker={ticker} />
    </Card>
  )
}

export default TelegramCard
