import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Setting, TelegramSetting } from '../../api/Settings'
import useAuth from '../../contexts/useAuth'
import useTelegramSettingsQuery from '../../queries/useTelegramSettingsQuery'
import SettingsCard from './SettingsCard'
import TelegramSettingsModalForm from './TelegramSettingsModalForm'

const TelegramSettingsCard: FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { t } = useTranslation()
  const { token } = useAuth()
  const query = useTelegramSettingsQuery({ token })

  return (
    <SettingsCard<{ setting: Setting<TelegramSetting> }>
      title="settings.telegram.title"
      description="settings.telegram.description"
      editTestId="telegramsetting-edit"
      queryKey="telegram_settings"
      errorMessage="Unable to fetch telegram settings from server."
      query={query}
    >
      {({ data, formOpen, onFormClose }) => (
        <>
          <Box sx={{ mb: 1 }}>
            <Typography color="GrayText" component="span" variant="body2">
              {t('settings.telegram.botUsername')}
            </Typography>
            <Typography>{data.setting.value.botUsername || '—'}</Typography>
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography color="GrayText" component="span" variant="body2">
              {t('settings.telegram.token')}
            </Typography>
            <Typography>{data.setting.value.token || '—'}</Typography>
          </Box>
          <TelegramSettingsModalForm onClose={onFormClose} open={formOpen} setting={data.setting} onSaved={onSaved} />
        </>
      )}
    </SettingsCard>
  )
}

export default TelegramSettingsCard
