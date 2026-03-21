import { faBluesky } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, CardActions, CardContent, Chip, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerBlueskyApi, putTickerBlueskyApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import CopyToClipboard from '../common/CopyToClipboard'
import BlueskyModalForm from './BlueskyModalForm'

interface Props {
  ticker: Ticker
}

const BlueskyCard: FC<Props> = ({ ticker }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const bluesky = ticker.bluesky

  const handleDelete = () => {
    handleApiCall(deleteTickerBlueskyApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t('integrations.bluesky.deleted'), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('integrations.bluesky.errorDelete'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const handleToggle = () => {
    handleApiCall(putTickerBlueskyApi(token, { active: !bluesky.active }, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t(bluesky.active ? 'integrations.bluesky.disabled' : 'integrations.bluesky.enabled'), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('integrations.bluesky.errorUpdate'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const profileUrl = 'https://bsky.app/profile/' + bluesky.handle

  const replyRestrictionLabel = (restriction: string): string => {
    switch (restriction) {
      case 'followers':
        return t('integrations.bluesky.replyRestrictionFollowers')
      case 'following':
        return t('integrations.bluesky.replyRestrictionFollowing')
      case 'mentioned':
        return t('integrations.bluesky.replyRestrictionMentioned')
      case 'nobody':
        return t('integrations.bluesky.replyRestrictionNobody')
      default:
        return t('integrations.bluesky.replyRestrictionAnyone')
    }
  }

  const statusChip = bluesky.connected ? (
    bluesky.active ? (
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
            <FontAwesomeIcon icon={faBluesky} /> Bluesky
          </Typography>
          {statusChip}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('integrations.bluesky.description')}
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardContent sx={{ flexGrow: 1 }}>
        {bluesky.connected ? (
          <Stack spacing={1}>
            <div>
              <Typography variant="caption" color="text.secondary">
                {t('integrations.profile')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Link href={profileUrl} rel="noreferrer" target="_blank" variant="body2">
                  {bluesky.handle}
                </Link>
                <CopyToClipboard text={profileUrl} />
              </Stack>
            </div>
            <div>
              <Typography variant="caption" color="text.secondary">
                {t('integrations.bluesky.replyRestriction')}
              </Typography>
              <Typography variant="body2">{replyRestrictionLabel(bluesky.replyRestriction)}</Typography>
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
        {bluesky.connected ? (
          <>
            {bluesky.active ? (
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
        {bluesky.connected ? (
          <Button onClick={handleDelete} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            {t('action.delete')}
          </Button>
        ) : null}
      </CardActions>
      <BlueskyModalForm open={open} onClose={() => setOpen(false)} ticker={ticker} />
    </Card>
  )
}

export default BlueskyCard
