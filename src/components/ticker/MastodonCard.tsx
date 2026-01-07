import { faMastodon } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardActions, CardContent, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerMastodonApi, putTickerMastodonApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import MastodonModalForm from './MastodonModalForm'
import { useTranslation } from 'react-i18next'

interface Props {
  ticker: Ticker
}

const MastodonCard: FC<Props> = ({ ticker }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const mastodon = ticker.mastodon

  const handleDelete = () => {
    handleApiCall(deleteTickerMastodonApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t("integrations.mastodon.deleted"), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t("integrations.mastodon.errorDelete"), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const handleToggle = () => {
    handleApiCall(putTickerMastodonApi(token, { active: !mastodon.active }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t(mastodon.active ? "integrations.mastodon.disabled" : "integrations.mastodon.enabled"), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t("integrations.mastodon.errorUpdate"), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const profileLink = (
    <Link href={mastodon.server + '/web/@' + mastodon.name} rel="noreferrer" target="_blank">
      @{mastodon.name}@{mastodon.server.replace(/^https?:\/\//, '')}
    </Link>
  )

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faMastodon} /> Mastodon
          </Typography>
          <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
            {t('action.configure')}
          </Button>
        </Stack>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        {mastodon.connected ? (
          <Box>
            <Typography variant="body2">{t('integrations.mastodon.connected')}</Typography>
            <Typography variant="body2">{t('integrations.yourProfile')} {profileLink}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography component="p" variant="body2">
              {t('integrations.mastodon.notConnected')}
            </Typography>
            <Typography component="p" variant="body2">
              {t('integrations.noNewMessages', { type: t('common.account') })}
            </Typography>
          </Box>
        )}
      </CardContent>
      {mastodon.connected ? (
        <CardActions>
          {mastodon.active ? (
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
      <MastodonModalForm onClose={() => setOpen(false)} open={open} ticker={ticker} />
    </Card>
  )
}

export default MastodonCard
