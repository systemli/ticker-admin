import { FormGroup, Grid, TextField } from '@mui/material'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Setting, SignalGroupSetting, SignalGroupSettingFormData, putSignalGroupSettingsApi } from '../../api/Settings'
import useSettingsFormSubmit from './useSettingsFormSubmit'

interface Props {
  name: string
  setting: Setting<SignalGroupSetting>
  callback: () => void
  setSubmitting: (submitting: boolean) => void
  onSaved?: () => void
}

const SignalGroupSettingsForm: FC<Props> = ({ name, setting, callback, setSubmitting, onSaved }) => {
  const { t } = useTranslation()
  const { handleSubmit, register } = useForm<SignalGroupSettingFormData>({
    defaultValues: {
      apiUrl: setting.value.apiUrl,
      account: setting.value.account,
      avatar: setting.value.avatar,
    },
  })

  const onSubmit = useSettingsFormSubmit<SignalGroupSettingFormData>({
    putApi: putSignalGroupSettingsApi,
    queryKey: 'signal_group_settings',
    successMessage: 'settings.signalGroup.updated',
    errorMessage: 'settings.signalGroup.errorUpdate',
    setSubmitting,
    callback,
    onSaved,
  })

  return (
    <form id={name} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('apiUrl')} label={t('settings.signalGroup.apiUrl')} placeholder={setting.value.apiUrl || ''} />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('account')} label={t('settings.signalGroup.account')} placeholder={setting.value.account || ''} />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('avatar')} label={t('settings.signalGroup.avatar')} placeholder={setting.value.avatar || ''} />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default SignalGroupSettingsForm
