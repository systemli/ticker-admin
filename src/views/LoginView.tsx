import { Alert, Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import logo from '../assets/logo.png'
import useAuth from '../contexts/useAuth'

interface FormValues {
  email: string
  password: string
}

const LoginView: FC = () => {
  const { t } = useTranslation()
  const { getValues, handleSubmit, register, reset } = useForm<FormValues>()
  const { login, error, user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<FormValues> = ({ email, password }) => {
    login(email, password)
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    } else {
      // We want to ensure logged out users will not have any caches stored
      queryClient.invalidateQueries()
    }
  })

  useEffect(() => {
    if (error) {
      reset({ email: getValues('email'), password: '' })
    }
  }, [error, getValues, reset])

  return (
    <Container fixed maxWidth="sm" sx={{ mt: 5 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img alt="Systemli Logo" src={logo} style={{ marginLeft: 'auto', marginRight: 'auto' }} />
            <Typography component="h4" sx={{ mt: 1 }} variant="h4">
              {t('user.tickerLogin')}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error.message}
                </Alert>
              ) : null}
              <TextField {...register('email')} autoFocus data-testid="email" fullWidth label={t('user.email')} required sx={{ my: 1 }} type="email" />
              <TextField {...register('password')} data-testid="password" fullWidth label={t('user.password')} required sx={{ my: 1 }} type="password" />
              <Button data-testid="submit" fullWidth size="large" sx={{ my: 1 }} type="submit" variant="contained">
                {t('user.login')}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default LoginView
