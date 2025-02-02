import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, FormGroup, InputAdornment, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { handleApiCall } from '../../api/Api'
import { Ticker, TickerSignalGroupAdminFormData, putTickerSignalGroupAdminApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  callback: () => void
  ticker: Ticker
  setSubmitting: (submitting: boolean) => void
}

const SignalGroupAdminForm: FC<Props> = ({ callback, ticker, setSubmitting }) => {
  const { token } = useAuth()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<TickerSignalGroupAdminFormData>()
  const { createNotification } = useNotification()

  const onSubmit = handleSubmit(data => {
    setSubmitting(true)

    handleApiCall(putTickerSignalGroupAdminApi(token, data, ticker), {
      onSuccess: () => {
        createNotification({ content: 'Number successfully added to Signal group', severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: 'Failed to add number to Signal group', severity: 'error' })
        setError('number', { message: 'Failed to add number to Signal group' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })

    setSubmitting(false)
  })

  return (
    <form id="configureSignalGroupAdmin" onSubmit={onSubmit}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning">Only do this if extra members with write access are needed.</Alert>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField
              {...register('number')}
              label="Phone number"
              placeholder="+49123456789"
              required
              helperText={errors.number ? errors.number?.message : null}
              error={errors.number ? true : false}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faPhone} />
                  </InputAdornment>
                ),
              }}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default SignalGroupAdminForm
