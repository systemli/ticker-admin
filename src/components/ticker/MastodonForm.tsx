import { Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Ticker, TickerMastodonFormData, putTickerMastodonApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'

interface Props {
  callback: () => void
  ticker: Ticker
}

const MastodonForm: FC<Props> = ({ callback, ticker }) => {
  const mastodon = ticker.mastodon
  const { token } = useAuth()
  const { handleSubmit, register } = useForm<TickerMastodonFormData>({
    defaultValues: {
      active: mastodon.active,
      server: mastodon.server,
    },
  })
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<TickerMastodonFormData> = data => {
    putTickerMastodonApi(token, data, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
      callback()
    })
  }

  return (
    <form id="configureMastodon" onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid size={{ xs: 12 }}>
          <Typography>
            You need to create a Application for Ticker in Mastodon. Go to your profile settings in Mastodon. You find a menu point "Developer" where you need
            to create an Application. After saving you see the required secrets and tokens.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Required Scopes: <code>read write write:media write:statuses</code>
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register('active')} defaultChecked={ticker.mastodon.active} />} label="Active" />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('server')} defaultValue={ticker.mastodon.server} label="Server" placeholder="https://mastodon.social" required />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('token')} label="Client Key" required />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('secret')} label="Client Secret" required type="password" />
          </FormGroup>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormGroup>
            <TextField {...register('accessToken')} label="Access Token" required type="password" />
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  )
}

export default MastodonForm
