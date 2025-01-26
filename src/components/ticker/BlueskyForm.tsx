import { Alert, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Ticker, TickerBlueskyFormData, putTickerBlueskyApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'

interface Props {
  callback: () => void
  ticker: Ticker
}

const BlueskyForm: FC<Props> = ({ callback, ticker }) => {
  const bluesky = ticker.bluesky
  const { token } = useAuth()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<TickerBlueskyFormData>({
    defaultValues: {
      active: bluesky.active,
      handle: bluesky.handle,
      appKey: bluesky.appKey,
    },
  })
  const queryClient = useQueryClient()

  const onSubmit = handleSubmit(data => {
    putTickerBlueskyApi(token, data, ticker).then(response => {
      if (response.status == 'error') {
        setError('root.authenticationFailed', { message: 'Authentication failed' })
      } else {
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        callback()
      }
    })
  })

  return (
    <form id="configureBluesky" onSubmit={onSubmit}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          <Typography>You need to create a application password in Bluesky.</Typography>
        </Grid>
        {errors.root?.authenticationFailed && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error">{errors.root.authenticationFailed.message}</Alert>
          </Grid>
        )}
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register('active')} defaultChecked={ticker.bluesky.active} />} label="Active" />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('handle')} defaultValue={ticker.bluesky.handle} label="Handle" placeholder="handle.bsky.social" required />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('appKey')} label="Application Password" type="password" required />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default BlueskyForm
