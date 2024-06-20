import { FC, useEffect } from 'react'
import { Ticker, TickerSignalGroupAdminFormData, putTickerSignalGroupAdminApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, FormGroup, Grid, TextField, Typography } from '@mui/material'

interface Props {
  ticker: Ticker
}

const SignalGroupAdminForm: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
    reset,
    formState,
  } = useForm<TickerSignalGroupAdminFormData>()
  const queryClient = useQueryClient()

  const onSubmit = handleSubmit(data => {
    putTickerSignalGroupAdminApi(token, data, ticker).then(response => {
      if (response.status == 'error') {
        setError('root.failed', { message: 'Failed to add number' })
      } else {
        // TODO: required?
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        reset()
      }
    })
  })

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset()
    }
  }, [formState, reset])

  return (
    <form id="configureSignalGroupAdmin" onSubmit={onSubmit}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item xs={12}>
          <Typography>Add more admins to the Signal group. If the number is not a member yet, it's added automatically.</Typography>
          <Alert severity="warning">Only do this if extra members with write access are needed.</Alert>
        </Grid>
        {errors.root?.failed && (
          <Grid item xs={12}>
            <Alert severity="error">{errors.root.failed.message}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <FormGroup>
            <TextField {...register('number')} label="Signal contact number" placeholder="Signal contact number" required />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default SignalGroupAdminForm
