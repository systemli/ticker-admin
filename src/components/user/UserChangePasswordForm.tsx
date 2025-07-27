import { Alert, FormGroup, Grid, TextField } from '@mui/material'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { handleApiCall } from '../../api/Api'
import { putMeApi } from '../../api/User'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'

interface Props {
  id: string
  onClose: () => void
  setSubmitting: (submitting: boolean) => void
}

interface FormValues {
  password: string
  newPassword: string
  newPasswordValidate: string
}

const UserChangePasswordForm: FC<Props> = ({ id, onClose, setSubmitting }) => {
  const { createNotification } = useNotification()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<FormValues>()
  const { token } = useAuth()

  const onSubmit: SubmitHandler<FormValues> = data => {
    setSubmitting(true)

    handleApiCall(putMeApi(token, data), {
      onSuccess: () => {
        createNotification({ content: 'Password successfully updated', severity: 'success' })
        onClose()
      },
      onError: response => {
        const message = response.error?.message === 'could not authenticate password' ? 'Wrong password' : 'Something went wrong'

        setError('password', {
          type: 'custom',
          message: message,
        })

        createNotification({ content: 'Failed to update password', severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })

    setSubmitting(false)
  }

  const newPassword = watch('newPassword', '')

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          {errors.password && <Alert severity="error">{errors.password.message}</Alert>}
          <FormGroup>
            <TextField margin="normal" {...register('password')} label="Password" required type="password" />
          </FormGroup>
          <FormGroup>
            <TextField
              error={errors.newPassword !== undefined}
              margin="normal"
              {...register('newPassword', {
                minLength: {
                  value: 10,
                  message: 'Password must have at least 10 characters',
                },
              })}
              helperText={errors.newPassword?.message}
              label="New Password"
              type="password"
            />
            <TextField
              error={errors.newPasswordValidate !== undefined}
              margin="dense"
              {...register('newPasswordValidate', {
                validate: value => value === newPassword || 'The passwords do not match',
              })}
              helperText={errors.newPasswordValidate?.message}
              label="Repeat new Password"
              required
              type="password"
            />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default UserChangePasswordForm
