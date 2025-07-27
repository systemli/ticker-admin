import { Checkbox, Divider, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { handleApiCall } from '../../api/Api'
import { Ticker } from '../../api/Ticker'
import { User, postUserApi, putUserApi } from '../../api/User'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import TickersDropdown from '../ticker/TickersDropdown'

interface Props {
  id: string
  user?: User
  callback: () => void
  setSubmitting: (submitting: boolean) => void
}

interface FormValues {
  email: string
  isSuperAdmin: boolean
  password: string
  password_validate: string
  tickers: Array<Ticker>
}

const UserForm: FC<Props> = ({ id, user, callback, setSubmitting }) => {
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      email: user?.email,
      isSuperAdmin: user?.isSuperAdmin,
      tickers: user?.tickers,
    },
  })
  const queryClient = useQueryClient()
  const isSuperAdminChecked = watch('isSuperAdmin')
  const password = watch('password', '')

  const onSubmit: SubmitHandler<FormValues> = data => {
    setSubmitting(true)

    const formData = {
      email: data.email,
      isSuperAdmin: data.isSuperAdmin,
      password: data.password,
      tickers: data.tickers,
    }

    const apiCall = user ? putUserApi(token, user, formData) : postUserApi(token, formData)

    handleApiCall(apiCall, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        createNotification({ content: `User was successfully ${user ? 'updated' : 'created'}`, severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: `Failed to ${user ? 'update' : 'create'} user`, severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })

    setSubmitting(false)
  }

  useEffect(() => {
    register('tickers')
  })

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ md: 6, xs: 12 }}>
          <FormGroup>
            <TextField
              error={errors.email !== undefined}
              margin="normal"
              {...register('email')}
              defaultValue={user ? user.email : ''}
              label="E-Mail"
              name="email"
              required
              type="email"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register('isSuperAdmin')} defaultChecked={user?.isSuperAdmin} />} label="Super Admin" />
          </FormGroup>
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>
          <FormGroup>
            <TextField
              error={errors.password !== undefined}
              margin="normal"
              {...register('password', {
                minLength: {
                  value: 8,
                  message: 'Password must have at least 8 characters',
                },
              })}
              helperText={errors.password?.message}
              label="Password"
              name="password"
              required={!user}
              type="password"
            />
            <TextField
              error={errors.password_validate !== undefined}
              margin="dense"
              {...register('password_validate', {
                validate: value => value === password || 'The passwords do not match',
              })}
              helperText={errors.password_validate?.message}
              label="Repeat Password"
              name="password_validate"
              required={!user}
              type="password"
            />
          </FormGroup>
        </Grid>
        {!isSuperAdminChecked ? (
          <Grid size={{ xs: 12 }}>
            <Divider />
            <Typography component="h6" sx={{ my: 1 }} variant="h6">
              Permissions
            </Typography>
            <TickersDropdown
              defaultValue={user?.tickers || []}
              name="tickers"
              onChange={tickers => {
                setValue('tickers', tickers)
              }}
              sx={{ width: '100%' }}
            />
          </Grid>
        ) : null}
      </Grid>
    </form>
  )
}

export default UserForm
