import { FormGroup, Grid, TextField } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { RefreshIntervalSetting, Setting, putRefreshIntervalApi } from '../../api/Settings'
import useAuth from '../../contexts/useAuth'

interface Props {
  name: string
  setting: Setting<RefreshIntervalSetting>
  callback: () => void
}

interface FormValues {
  refreshInterval: number
}

const RefreshIntervalForm: FC<Props> = ({ name, setting, callback }) => {
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      refreshInterval: parseInt(setting.value.refreshInterval, 10),
    },
  })
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = data => {
    putRefreshIntervalApi(token, data.refreshInterval)
      .then(() => queryClient.invalidateQueries({ queryKey: ['refresh_interval_setting'] }))
      .finally(() => callback())
  }

  return (
    <form id={name} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item xs={12}>
          <FormGroup>
            <TextField
              margin="dense"
              {...register('refreshInterval', { valueAsNumber: true })}
              defaultValue={setting.value.refreshInterval}
              label="Interval"
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
