import React, { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { User, useUserApi } from '../../api/User'
import { useQueryClient } from '@tanstack/react-query'
import useAuth from '../useAuth'
import { FormControlLabel, Checkbox, FormGroup, TextField, Typography, Grid, Divider } from '@mui/material'
import TickersDropdown from '../ticker/TickersDropdown'

interface Props {
  id: string
  user?: User
  callback: () => void
}

interface FormValues {
  email: string
  isSuperAdmin: boolean
  password: string
  password_validate: string
  tickers: Array<number>
}

const UserForm: FC<Props> = ({ id, user, callback }) => {
  const { token } = useAuth()
  const { postUser, putUser } = useUserApi(token)
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
    const formData = {
      email: data.email,
      isSuperAdmin: data.isSuperAdmin,
      password: data.password,
      tickers: data.tickers,
    }

    if (user) {
      putUser(formData, user).finally(() => {
        queryClient.invalidateQueries(['users'])
        callback()
      })
    } else {
      postUser(formData).finally(() => {
        queryClient.invalidateQueries(['users'])
        callback()
      })
    }
  }

  useEffect(() => {
    register('tickers')
  })

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item md={6} xs={12}>
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
        <Grid item md={6} xs={12}>
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
          <Grid item xs={12}>
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
