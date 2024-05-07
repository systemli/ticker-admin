import { FC } from 'react'
import { Ticker, TickerSignalGroupFormData, putTickerSignalGroupApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'

interface Props {
  callback: () => void
  ticker: Ticker
}

const SignalGroupForm: FC<Props> = ({ callback, ticker }) => {
  const signalGroup = ticker.signalGroup
  const { token } = useAuth()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<TickerSignalGroupFormData>({
    defaultValues: {
      active: signalGroup.active,
      groupName: signalGroup.groupName,
      groupDescription: signalGroup.groupDescription,
    },
  })
  const queryClient = useQueryClient()

  const onSubmit = handleSubmit(data => {
    putTickerSignalGroupApi(token, data, ticker).then(response => {
      if (response.status == 'error') {
        setError('root.authenticationFailed', { message: 'Authentication failed' })
      } else {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        callback()
      }
    })
  })

  return (
    <form id="configureSignalGroup" onSubmit={onSubmit}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item xs={12}>
          {signalGroup.groupID ? (
            <Typography>The Signal group will be updated with these settings.</Typography>
          ) : (
            <Typography>A new Signal group will be created with these settings.</Typography>
          )}
        </Grid>
        {errors.root?.authenticationFailed && (
          <Grid item xs={12}>
            <Alert severity="error">{errors.root.authenticationFailed.message}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register('active')} defaultChecked={ticker.signalGroup.active} />} label="Active" />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <TextField {...register('groupName')} defaultValue={ticker.signalGroup.groupName} label="Group name" placeholder="Group name" required />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <TextField
              {...register('groupDescription')}
              defaultValue={ticker.signalGroup.groupDescription}
              label="Group description"
              placeholder="Group description"
              required
            />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default SignalGroupForm
