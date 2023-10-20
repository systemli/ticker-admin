import React, { FC } from 'react'
import { Alert, FormGroup, Grid, TextField } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAuth from '../useAuth'
import { useUserApi } from '../../api/User'

interface Props {
  id: string
  onClose: () => void
}

interface FormValues {
  password: string
  newPassword: string
  newPasswordValidate: string
}

const UserChangePasswordForm: FC<Props> = ({ id, onClose }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<FormValues>()
  const { token } = useAuth()
  const { putMe } = useUserApi(token)

  const onSubmit: SubmitHandler<FormValues> = data => {
    putMe(data).then(response => {
      if (response.status === 'error') {
        const message = response.error?.message === 'could not authenticate password' ? 'Wrong password' : 'Something went wrong'

        setError('password', {
          type: 'custom',
          message: message,
        })
      } else {
        onClose()
      }
    })
  }

  const newPassword = watch('newPassword', '')

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item xs={12}>
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
