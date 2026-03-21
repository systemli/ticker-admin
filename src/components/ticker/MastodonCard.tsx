import { faMastodon } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerMastodonApi, putTickerMastodonApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import CopyToClipboard from '../common/CopyToClipboard'
import IntegrationCard, { IntegrationStatus } from './IntegrationCard'
import MastodonModalForm from './MastodonModalForm'

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
        createNotification({ content: t('integrations.mastodon.deleted'), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('integrations.mastodon.errorDelete'), severity: 'error' })
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
        createNotification({ content: t(mastodon.active ? 'integrations.mastodon.disabled' : 'integrations.mastodon.enabled'), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('integrations.mastodon.errorUpdate'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const profileUrl = mastodon.server + '/web/@' + mastodon.name
  const profileHandle = `@${mastodon.name}@${mastodon.server.replace(/^https?:\/\//, '')}`

  const status: IntegrationStatus = mastodon.connected ? (mastodon.active ? 'active' : 'inactive') : 'notConfigured'

  const details = mastodon.connected ? (
    <Stack spacing={1}>
      <div>
        <Typography variant="caption" color="text.secondary">
          {t('integrations.profile')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link href={profileUrl} rel="noreferrer" target="_blank" variant="body2">
            {profileHandle}
          </Link>
          <CopyToClipboard text={profileUrl} />
        </Stack>
      </div>
    </Stack>
  ) : null

  const actions = (
    <>
      {mastodon.connected ? (
        <>
          {mastodon.active ? (
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
      {mastodon.connected ? (
        <Button onClick={handleDelete} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
          {t('action.delete')}
        </Button>
      ) : null}
    </>
  )

  return (
    <IntegrationCard
      icon={faMastodon}
      title="Mastodon"
      description={t('integrations.mastodon.description')}
      status={status}
      details={details}
      actions={actions}
    >
      <MastodonModalForm onClose={() => setOpen(false)} open={open} ticker={ticker} />
    </IntegrationCard>
  )
}

export default MastodonCard
