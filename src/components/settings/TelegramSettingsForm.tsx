import { FormGroup, Grid, TextField } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { handleApiCall } from '../../api/Api'
import { Setting, TelegramSetting, TelegramSettingFormData, putTelegramSettingsApi } from '../../api/Settings'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  name: string
  setting: Setting<TelegramSetting>
  callback: () => void
  setSubmitting: (submitting: boolean) => void
  onSaved?: () => void
}

const TelegramSettingsForm: FC<Props> = ({ name, setting, callback, setSubmitting, onSaved }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { handleSubmit, register } = useForm<TelegramSettingFormData>({
    defaultValues: {
      token: '',
    },
  })
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<TelegramSettingFormData> = data => {
    setSubmitting(true)
    handleApiCall(putTelegramSettingsApi(token, data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['telegram_settings'] })
        onSaved?.()
        createNotification({ content: t('settings.telegram.updated'), severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: t('settings.telegram.errorUpdate'), severity: 'error' })
      },
      onFailure: () => {
        createNotification({ content: t('settings.telegram.errorUpdate'), severity: 'error' })
      },
    }).finally(() => {
      setSubmitting(false)
    })
  }

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
