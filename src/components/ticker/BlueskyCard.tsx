import { faBluesky } from '@fortawesome/free-brands-svg-icons'
import { faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardActions, CardContent, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerBlueskyApi, putTickerBlueskyApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import BlueskyModalForm from './BlueskyModalForm'
import { useTranslation } from 'react-i18next'

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

  const profileLink = (
    <Link href={'https://bsky.app/profile/' + bluesky.handle} rel="noreferrer" target="_blank">
      {bluesky.handle}
    </Link>
  )

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

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faBluesky} /> Bluesky
          </Typography>
          <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
            {t('action.configure')}
          </Button>
        </Stack>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        {bluesky.connected ? (
          <Box>
            <Typography variant="body2">{t('integrations.bluesky.connected')}</Typography>
            <Typography variant="body2">
              {t('integrations.yourProfile')} {profileLink}
            </Typography>
            <Typography variant="body2">
              {t('integrations.bluesky.replyRestriction')}: {replyRestrictionLabel(bluesky.replyRestriction)}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2">{t('integrations.bluesky.notConnected')}</Typography>
            <Typography variant="body2">{t('integrations.noNewMessages', { type: t('common.account') })}</Typography>
          </Box>
        )}
      </CardContent>
      {bluesky.connected ? (
        <CardActions>
          {bluesky.active ? (
            <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPause} />}>
              {t('action.disable')}
            </Button>
          ) : (
            <Button onClick={handleToggle} size="small" startIcon={<FontAwesomeIcon icon={faPlay} />}>
              {t('action.enable')}
            </Button>
          )}
          <Button onClick={handleDelete} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            {t('action.delete')}
          </Button>
        </CardActions>
      ) : null}
      <BlueskyModalForm open={open} onClose={() => setOpen(false)} ticker={ticker} />
    </Card>
  )
}

export default BlueskyCard
