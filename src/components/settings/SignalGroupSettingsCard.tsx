import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Setting, SignalGroupSetting } from '../../api/Settings'
import useAuth from '../../contexts/useAuth'
import useSignalGroupSettingsQuery from '../../queries/useSignalGroupSettingsQuery'
import SettingsCard from './SettingsCard'
import SignalGroupSettingsModalForm from './SignalGroupSettingsModalForm'

const SignalGroupSettingsCard: FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const { t } = useTranslation()
  const { token } = useAuth()
  const query = useSignalGroupSettingsQuery({ token })

  return (
    <SettingsCard<{ setting: Setting<SignalGroupSetting> }>
      title="settings.signalGroup.title"
      description="settings.signalGroup.description"
      editTestId="signalgroupsetting-edit"
      queryKey="signal_group_settings"
      errorMessage="Unable to fetch signal group settings from server."
      query={query}
    >
      {({ data, formOpen, onFormClose }) => (
        <>
          <Box sx={{ mb: 1 }}>
            <Typography color="GrayText" component="span" variant="body2">
              {t('settings.signalGroup.apiUrl')}
            </Typography>
            <Typography>{data.setting.value.apiUrl || '—'}</Typography>
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography color="GrayText" component="span" variant="body2">
              {t('settings.signalGroup.account')}
            </Typography>
            <Typography>{data.setting.value.account || '—'}</Typography>
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography color="GrayText" component="span" variant="body2">
              {t('settings.signalGroup.avatar')}
            </Typography>
            <Typography>{data.setting.value.avatar || '—'}</Typography>
          </Box>
          <SignalGroupSettingsModalForm onClose={onFormClose} open={formOpen} setting={data.setting} onSaved={onSaved} />
        </>
      )}
    </SettingsCard>
  )
}

export default SignalGroupSettingsCard
