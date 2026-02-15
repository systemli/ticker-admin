import { FormGroup, Grid, TextField } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { handleApiCall } from '../../api/Api'
import { InactiveSetting, Setting, putInactiveSettingsApi } from '../../api/Settings'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  name: string
  setting: Setting<InactiveSetting>
  callback: () => void
  setSubmitting: (submitting: boolean) => void
}

interface FormValues {
  headline: string
  subHeadline: string
  description: string
  author: string
  email: string
  homepage: string
  twitter: string
}

const InactiveSettingsForm: FC<Props> = ({ name, setting, callback, setSubmitting }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      headline: setting.value.headline,
      subHeadline: setting.value.subHeadline,
      description: setting.value.description,
      author: setting.value.author,
      email: setting.value.email,
      homepage: setting.value.homepage,
      twitter: setting.value.twitter,
    },
  })
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = data => {
    setSubmitting(true)
    handleApiCall(putInactiveSettingsApi(token, data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inactive_settings'] })
        createNotification({ content: 'Inactive settings successfully updated', severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: 'Failed to updating inactive settings', severity: 'error' })
      },
      onFailure: () => {
        createNotification({ content: 'Failed to updating inactive settings', severity: 'error' })
      },
    })

    setSubmitting(false)
  }

  return (
    <form id={name} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('headline')} defaultValue={setting.value.headline} label={t('common.headline')} name="headline" required />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('subHeadline')} defaultValue={setting.value.subHeadline} label={t('common.subheadline')} required />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField
              margin="normal"
              maxRows={10}
              multiline
              {...register('description')}
              defaultValue={setting.value.description}
              label={t('common.description')}
              required
            />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('author')} defaultValue={setting.value.author} label={t('common.author')} name="author" required />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField
              margin="dense"
              {...register('homepage')}
              defaultValue={setting.value.homepage}
              label={t('integrations.homepage')}
              name="homepage"
              required
              type="url"
            />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('email')} defaultValue={setting.value.email} label={t('user.email')} name="email" required type="email" />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('twitter')} defaultValue={setting.value.twitter} label={t('social.twitter')} name="twitter" required />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default InactiveSettingsForm
