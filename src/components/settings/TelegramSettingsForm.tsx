import { FormGroup, Grid, TextField } from '@mui/material'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Setting, TelegramSetting, TelegramSettingFormData, putTelegramSettingsApi } from '../../api/Settings'
import useSettingsFormSubmit from './useSettingsFormSubmit'

interface Props {
  name: string
  setting: Setting<TelegramSetting>
  callback: () => void
  setSubmitting: (submitting: boolean) => void
  onSaved?: () => void
}

const TelegramSettingsForm: FC<Props> = ({ name, setting, callback, setSubmitting, onSaved }) => {
  const { t } = useTranslation()
  const { handleSubmit, register } = useForm<TelegramSettingFormData>({
    defaultValues: {
      token: '',
    },
  })

  const onSubmit = useSettingsFormSubmit<TelegramSettingFormData>({
    putApi: putTelegramSettingsApi,
    queryKey: 'telegram_settings',
    successMessage: 'settings.telegram.updated',
    errorMessage: 'settings.telegram.errorUpdate',
    setSubmitting,
    callback,
    onSaved,
  })

  return (
    <form id={name} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" disabled value={setting.value.botUsername || '—'} label={t('settings.telegram.botUsername')} />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField
              margin="dense"
              {...register('token')}
              label={t('settings.telegram.token')}
              placeholder={setting.value.token || ''}
              helperText={t('settings.telegram.tokenHelp')}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default TelegramSettingsForm
