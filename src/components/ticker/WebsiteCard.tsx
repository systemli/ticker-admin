import { faGear, faGlobe, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, CardActions, CardContent, Chip, Divider, Link, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { handleApiCall } from '../../api/Api'
import { deleteTickerWebsitesApi, Ticker } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import WebsiteModalForm from './WebsiteModalForm'

interface Props {
  ticker: Ticker
}

const WebsiteCard: FC<Props> = ({ ticker }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const websites = ticker.websites

  const handleDelete = () => {
    handleApiCall(deleteTickerWebsitesApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t('integrations.website.deleted'), severity: 'success' })
      },
      onError: () => {
        createNotification({ content: t('integrations.website.errorDelete'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  const isConfigured = websites.length > 0

  const statusChip = isConfigured ? (
    <Chip label={t('integrations.integrationStatus.configured')} color="success" size="small" variant="outlined" />
  ) : (
    <Chip label={t('integrations.integrationStatus.notConfigured')} size="small" variant="outlined" />
  )

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1}>
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faGlobe} /> Websites
          </Typography>
          {statusChip}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('integrations.website.description')}
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardContent sx={{ flexGrow: 1 }}>
        {isConfigured ? (
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {t('integrations.website.allowed')}
            </Typography>
            {websites.map(website => (
              <Link href={website.origin} rel="noreferrer" target="_blank" variant="body2" key={website.id}>
                {website.origin}
              </Link>
            ))}
          </Stack>
        ) : (
          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
            {t('integrations.notConfiguredHint')}
          </Typography>
        )}
      </CardContent>
      <Divider variant="middle" />
      <CardActions>
        <Button onClick={() => setOpen(true)} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
          {t('action.configure')}
        </Button>
        {isConfigured ? (
          <Button onClick={handleDelete} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            {t('action.delete')}
          </Button>
        ) : null}
      </CardActions>
      <WebsiteModalForm onClose={() => setOpen(false)} open={open} ticker={ticker} />
    </Card>
  )
}

export default WebsiteCard
