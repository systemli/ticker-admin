import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { handleApiCall } from '../../api/Api'
import { Ticker, TickerMastodonFormData, putTickerMastodonApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import { useTranslation } from 'react-i18next'

interface Props {
  callback: () => void
  ticker: Ticker
}

const MastodonForm: FC<Props> = ({ callback, ticker }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const mastodon = ticker.mastodon
  const { token } = useAuth()
  const { handleSubmit, register } = useForm<TickerMastodonFormData>({
    defaultValues: {
      active: mastodon.active,
      server: mastodon.server,
    },
  })
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<TickerMastodonFormData> = data => {
    handleApiCall(putTickerMastodonApi(token, data, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t('integrations.mastodon.updated'), severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: t('integrations.mastodon.errorUpdate'), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  return (
    <form id="configureMastodon" onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          <Typography>{t('integrations.mastodon.createApplication')}</Typography>
          <Typography sx={{ mt: 1 }}>
            {t('application.requiredScopes')} <code>read write write:media write:statuses</code>
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register('active')} defaultChecked={ticker.mastodon.active} />} label={t('status.active')} />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField
              {...register('server')}
              defaultValue={ticker.mastodon.server}
              label={t('application.server')}
              placeholder="https://mastodon.social"
              required
            />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('token')} label={t('application.clientKey')} required />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('secret')} label={t('application.clientSecret')} required type="password" />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('accessToken')} label={t('application.accessToken')} required type="password" />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default MastodonForm
