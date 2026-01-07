import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { handleApiCall } from '../../api/Api'
import { Ticker, putTickerTelegramApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import { useTranslation } from 'react-i18next'

interface Props {
  callback: () => void
  ticker: Ticker
}

interface FormValues {
  active: boolean
  channelName: string
}

const TelegramForm: FC<Props> = ({ callback, ticker }) => {
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const telegram = ticker.telegram
  const { token } = useAuth()
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      active: telegram.active,
      channelName: telegram.channelName,
    },
  })
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = data => {
    handleApiCall(putTickerTelegramApi(token, data, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        createNotification({ content: t("integrations.telegram.updated"), severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: t("integrations.telegram.errorUpdate"), severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }

  return (
    <form id="configureTelegram" onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          <Typography>{t('integrations.telegram.onlyPublic')}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register('active')} defaultChecked={ticker.telegram.active} />} label={t("status.active")} />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField
              {...register('channelName', {
                pattern: {
                  value: /@\w+/i,
                  message: t("integrations.telegram.errorNaming"),
                },
              })}
              defaultValue={telegram.channelName}
              label={t('integrations.telegram.channel')}
              required
            />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default TelegramForm
