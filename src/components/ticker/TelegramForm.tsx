import React, { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from '@mui/material'

interface Props {
  callback: () => void
  ticker: Ticker
}

interface FormValues {
  active: boolean
  channel_name: string
}

const TelegramForm: FC<Props> = ({ callback, ticker }) => {
  const telegram = ticker.telegram
  const { token } = useAuth()
  const { putTickerTelegram } = useTickerApi(token)
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      active: telegram.active,
      channel_name: telegram.channel_name,
    },
  })
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = data => {
    putTickerTelegram(data, ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
      callback()
    })
  }

  return (
    <form id="configureTelegram" onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item xs={12}>
          <Typography>
            Only public Telegram Channels are supported. The name of the Channel
            is prefixed with an @ (e.g. @channel).
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('active')}
                  defaultChecked={ticker.telegram.active}
                />
              }
              label="Active"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <TextField
              {...register('channel_name', {
                pattern: {
                  value: /@\w+/i,
                  message: 'The Channel must start with an @',
                },
              })}
              defaultValue={telegram.channel_name}
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
