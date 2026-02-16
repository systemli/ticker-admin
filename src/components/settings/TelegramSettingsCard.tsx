import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useAuth from '../../contexts/useAuth'
import useTelegramSettingsQuery from '../../queries/useTelegramSettingsQuery'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'
import TelegramSettingsModalForm from './TelegramSettingsModalForm'

const TelegramSettingsCard: FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { t } = useTranslation()
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const { token } = useAuth()
  const { isLoading, error, data } = useTelegramSettingsQuery({ token })

  const handleFormOpen = () => {
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
  }

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error' || data.data === undefined) {
    return <ErrorView queryKey={['telegram_settings']}>Unable to fetch telegram settings from server.</ErrorView>
  }

  const setting = data.data?.setting

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h3" variant="h5">
            {t('settings.telegram.title')}
          </Typography>
          <Button data-testid="telegramsetting-edit" onClick={handleFormOpen} size="small" startIcon={<FontAwesomeIcon icon={faPencil} />}>
            {t('action.edit')}
          </Button>
        </Stack>
        <Typography color="GrayText" component="span" variant="body2">
          {t('settings.telegram.description')}
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography color="GrayText" component="span" variant="body2">
            {t('settings.telegram.botUsername')}
          </Typography>
          <Typography>{setting.value.botUsername || '—'}</Typography>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography color="GrayText" component="span" variant="body2">
            {t('settings.telegram.token')}
          </Typography>
          <Typography>{setting.value.token || '—'}</Typography>
        </Box>
        <TelegramSettingsModalForm onClose={handleFormClose} open={formOpen} setting={setting} onSaved={onSaved} />
      </CardContent>
    </Card>
  )
}

export default TelegramSettingsCard
