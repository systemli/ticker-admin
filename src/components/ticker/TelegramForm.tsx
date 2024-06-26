import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Ticker, putTickerTelegramApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'

interface Props {
  callback: () => void
  ticker: Ticker
}

interface FormValues {
  active: boolean
  channelName: string
}

const TelegramForm: FC<Props> = ({ callback, ticker }) => {
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
    putTickerTelegramApi(token, data, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
      callback()
    })
  }

  return (
    <form id="configureTelegram" onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item xs={12}>
          <Typography>Only public Telegram Channels are supported. The name of the Channel is prefixed with an @ (e.g. @channel).</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register('active')} defaultChecked={ticker.telegram.active} />} label="Active" />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <TextField
              {...register('channelName', {
                pattern: {
                  value: /@\w+/i,
                  message: 'The Channel must start with an @',
                },
              })}
              defaultValue={telegram.channelName}
              label="Channel"
              required
            />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default TelegramForm
