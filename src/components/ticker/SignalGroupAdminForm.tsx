import { Alert, FormGroup, Grid, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Ticker, TickerSignalGroupAdminFormData, putTickerSignalGroupAdminApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  callback: () => void
  ticker: Ticker
}

const SignalGroupAdminForm: FC<Props> = ({ callback, ticker }) => {
  const { token } = useAuth()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<TickerSignalGroupAdminFormData>()
  const { createNotification } = useNotification()

  const onSubmit = handleSubmit(data => {
    putTickerSignalGroupAdminApi(token, data, ticker).then(response => {
      if (response.status == 'error') {
        createNotification({ content: 'Failed to add number to Signal group', severity: 'error' })
        setError('number', { message: 'Failed to add number to Signal group' })
      } else {
        createNotification({ content: 'Number successfully added to Signal group', severity: 'success' })
        callback()
      }
    })
  })

  return (
    <form id="configureSignalGroupAdmin" onSubmit={onSubmit}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item xs={12}>
          <Alert severity="warning">Only do this if extra members with write access are needed.</Alert>
        </Grid>
        <Grid item xs={12}>
          <Typography>Add more admins to the Signal group. If the number is not a member yet, it's added automatically.</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <TextField
              {...register('number')}
              label="Signal contact number"
              placeholder="Signal contact number"
              required
              helperText={errors.number ? errors.number?.message : null}
              error={errors.number ? true : false}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default SignalGroupAdminForm
