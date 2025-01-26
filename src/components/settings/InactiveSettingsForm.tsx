import { FormGroup, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { InactiveSetting, Setting, putInactiveSettingsApi } from '../../api/Settings'
import useAuth from '../../contexts/useAuth'

interface Props {
  name: string
  setting: Setting<InactiveSetting>
  callback: () => void
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

const InactiveSettingsForm: FC<Props> = ({ name, setting, callback }) => {
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
    putInactiveSettingsApi(token, data)
      .then(() => queryClient.invalidateQueries({ queryKey: ['inactive_settings'] }))
      .finally(() => callback())
  }

  return (
    <form id={name} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('headline')} defaultValue={setting.value.headline} label="Headline" name="headline" required />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('subHeadline')} defaultValue={setting.value.subHeadline} label="Subheadline" required />
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
              label="Description"
              required
            />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('author')} defaultValue={setting.value.author} label="Author" name="author" required />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('homepage')} defaultValue={setting.value.homepage} label="Homepage" name="homepage" required type="url" />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('email')} defaultValue={setting.value.email} label="E-Mail" name="email" required type="email" />
          </FormGroup>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <FormGroup>
            <TextField margin="dense" {...register('twitter')} defaultValue={setting.value.twitter} label="Twitter" name="twitter" required />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default InactiveSettingsForm
