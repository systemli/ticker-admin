import React, { FC, useCallback, useEffect } from 'react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import useAuth from '../useAuth'
import LocationSearch, { Result } from './LocationSearch'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Button, Checkbox, FormControlLabel, FormGroup, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { faComputerMouse, faEnvelope, faSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faMastodon, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons'

interface Props {
  id: string
  ticker?: Ticker
  callback: () => void
}

interface FormValues {
  title: string
  domain: string
  active: boolean
  description: string
  information: {
    author: string
    email: string
    url: string
    twitter: string
    facebook: string
    telegram: string
    mastodon: string
    bluesky: string
  }
  location: {
    lat: number
    lon: number
  }
}

const TickerForm: FC<Props> = ({ callback, id, ticker }) => {
  const { handleSubmit, register, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: ticker?.title,
      domain: ticker?.domain,
      active: ticker?.active,
      description: ticker?.description,
      information: {
        author: ticker?.information.author,
        email: ticker?.information.email,
        url: ticker?.information.url,
        twitter: ticker?.information.twitter,
        facebook: ticker?.information.facebook,
        telegram: ticker?.information.telegram,
        mastodon: ticker?.information.mastodon,
        bluesky: ticker?.information.bluesky,
      },
      location: {
        lat: ticker?.location.lat || 0,
        lon: ticker?.location.lon || 0,
      },
    },
  })
  const { token } = useAuth()
  const { postTicker, putTicker } = useTickerApi(token)
  const queryClient = useQueryClient()

  const onLocationChange = useCallback(
    (result: Result) => {
      setValue('location.lat', result.lat)
      setValue('location.lon', result.lon)
    },
    [setValue]
  )

  const onLoctionReset = useCallback(
    (e: React.MouseEvent) => {
      setValue('location.lat', 0)
      setValue('location.lon', 0)

      e.preventDefault()
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (ticker) {
      putTicker(data, ticker.id).finally(() => {
        queryClient.invalidateQueries({ queryKey: ['tickers'] })
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        callback()
      })
    } else {
      postTicker(data).finally(() => {
        queryClient.invalidateQueries({ queryKey: ['tickers'] })
        callback()
      })
    }
  }

  useEffect(() => {
    register('location.lat', { valueAsNumber: true })
    register('location.lon', { valueAsNumber: true })
  })

  const position = watch('location')

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField {...register('title')} label="Title" margin="dense" required />
          </FormGroup>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField {...register('domain')} label="Domain" margin="dense" required />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register('active')} defaultChecked={ticker?.active} />} label="Active" />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <TextField margin="dense" maxRows={10} multiline {...register('description')} label="Description" required />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h6" variant="h6">
            Information
          </Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField
              {...register('information.author')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faUser} />
                  </InputAdornment>
                ),
              }}
              label="Author"
              margin="dense"
            />
          </FormGroup>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField
              {...register('information.url')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faComputerMouse} />
                  </InputAdornment>
                ),
              }}
              label="Homepage"
              margin="dense"
            />
          </FormGroup>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField
              {...register('information.email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </InputAdornment>
                ),
              }}
              label="E-Mail"
              margin="dense"
            />
          </FormGroup>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField
              {...register('information.twitter')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ marginRight: '0px' }}>
                    <FontAwesomeIcon icon={faTwitter} />
                    <span style={{ paddingLeft: '8px' }}>twitter.com/</span>
                  </InputAdornment>
                ),
              }}
              label="Twitter"
              margin="dense"
            />
          </FormGroup>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField
              {...register('information.facebook')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ marginRight: '0px' }}>
                    <FontAwesomeIcon icon={faFacebook} />
                    <span style={{ paddingLeft: '8px' }}>fb.com/</span>
                  </InputAdornment>
                ),
              }}
              label="Facebook"
              margin="dense"
            />
          </FormGroup>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField
              {...register('information.telegram')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ marginRight: '0px' }}>
                    <FontAwesomeIcon icon={faTelegram} />
                    <span style={{ paddingLeft: '8px' }}>t.me/</span>
                  </InputAdornment>
                ),
              }}
              label="Telegram"
              margin="dense"
            />
          </FormGroup>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField
              {...register('information.mastodon')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faMastodon} />
                  </InputAdornment>
                ),
              }}
              label="Mastodon"
              margin="dense"
            />
          </FormGroup>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormGroup>
            <TextField
              {...register('information.bluesky')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faSquare} />
                  </InputAdornment>
                ),
              }}
              label="Bluesky"
              margin="dense"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h6" variant="h6">
            Location
          </Typography>
          <Alert severity="info" variant="outlined">
            You can add a default location to the ticker. This will help you to have a pre-selected location when you add a map to a message. <br />
            Current Location:{' '}
            <code>
              {position.lat.toFixed(2)},{position.lon.toFixed(2)}
            </code>
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1}>
            <LocationSearch callback={onLocationChange} />
            <Button disabled={ticker?.location.lat === 0 && ticker.location.lon === 0} onClick={onLoctionReset} variant="outlined">
              Reset
            </Button>
          </Stack>
        </Grid>
        {position.lat !== 0 && position.lon !== 0 ? (
          <Grid item xs={12}>
            <MapContainer center={[position.lat, position.lon]} scrollWheelZoom={false} style={{ height: 200 }} zoom={10}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[position.lat, position.lon]} />
            </MapContainer>
          </Grid>
        ) : null}
      </Grid>
    </form>
  )
}

export default TickerForm
