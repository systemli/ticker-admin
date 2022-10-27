import React, { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Setting, useSettingsApi } from '../../api/Settings'
import useAuth from '../useAuth'
import { FormGroup, TextField } from '@mui/material'
import { Grid } from 'semantic-ui-react'

interface Props {
  name: string
  setting: Setting<string>
  callback: () => void
}

interface FormValues {
  refresh_interval: number
}

const RefreshIntervalForm: FC<Props> = ({ name, setting, callback }) => {
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      refresh_interval: parseInt(setting.value, 10),
    },
  })
  const { token } = useAuth()
  const { putRefreshInterval } = useSettingsApi(token)
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = data => {
    putRefreshInterval(data.refresh_interval)
      .then(() => queryClient.invalidateQueries(['refresh_interval_setting']))
      .finally(() => callback())
  }

  return (
    <form id={name} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item xs={12}>
          <FormGroup>
            <TextField
              margin="dense"
              {...register('refresh_interval', { valueAsNumber: true })}
              defaultValue={setting.value}
              label="Interval"
              name="refresh_interval"
              required
              type="number"
            />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default RefreshIntervalForm
