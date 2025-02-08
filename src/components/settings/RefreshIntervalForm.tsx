import { FormGroup, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { handleApiCall } from '../../api/Api'
import { putRefreshIntervalApi, RefreshIntervalSetting, Setting } from '../../api/Settings'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  name: string
  setting: Setting<RefreshIntervalSetting>
  callback: () => void
  setSubmitting: (submitting: boolean) => void
}

interface FormValues {
  refreshInterval: number
}

const RefreshIntervalForm: FC<Props> = ({ name, setting, callback, setSubmitting }) => {
  const { createNotification } = useNotification()
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      refreshInterval: parseInt(setting.value.refreshInterval, 10),
    },
  })
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = data => {
    setSubmitting(true)
    handleApiCall(putRefreshIntervalApi(token, data.refreshInterval), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['refresh_interval_setting'] })
        createNotification({ content: 'Refresh Interval successfully updated', severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: 'Failed to update refresh interval', severity: 'error' })
      },
      onFailure: () => {
        createNotification({ content: 'Failed to update refresh interval', severity: 'error' })
      },
    })
    setSubmitting(false)
  }

  return (
    <form id={name} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
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
