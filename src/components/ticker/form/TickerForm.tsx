import { Alert, Button, FormGroup, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQueryClient } from '@tanstack/react-query'
import React, { FC, useCallback, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Ticker, TickerFormData, postTickerApi, putTickerApi } from '../../../api/Ticker'
import useAuth from '../../../contexts/useAuth'
import LocationSearch, { Result } from '../LocationSearch'
import Active from './Active'
import Author from './Author'
import Bluesky from './Bluesky'
import Description from './Description'
import Email from './Email'
import Facebook from './Facebook'
import Instagram from './Instagram'
import Mastodon from './Mastodon'
import Telegram from './Telegram'
import Threads from './Threads'
import Title from './Title'
import Twitter from './Twitter'
import Url from './Url'

interface Props {
  id: string
  ticker?: Ticker
  callback: () => void
}

const TickerForm: FC<Props> = ({ callback, id, ticker }) => {
  const form = useForm<TickerFormData>({
    defaultValues: {
      title: ticker?.title,
      active: ticker?.active,
      description: ticker?.description,
      information: {
        author: ticker?.information.author,
        email: ticker?.information.email,
        url: ticker?.information.url,
        twitter: ticker?.information.twitter,
        facebook: ticker?.information.facebook,
        threads: ticker?.information.threads,
        instagram: ticker?.information.instagram,
        telegram: ticker?.information.telegram,
        mastodon: ticker?.information.mastodon,
        bluesky: ticker?.information.bluesky,
      },
      location: {
        lat: ticker?.location.lat ?? 0,
        lon: ticker?.location.lon ?? 0,
      },
    },
  })
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const { handleSubmit, register, setValue, watch } = form

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

  const onSubmit: SubmitHandler<TickerFormData> = data => {
    if (ticker) {
      putTickerApi(token, data, ticker.id).finally(() => {
        queryClient.invalidateQueries({ queryKey: ['tickers'] })
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
        callback()
      })
    } else {
      postTickerApi(token, data).finally(() => {
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
    <FormProvider {...form}>
      <form id={id} onSubmit={handleSubmit(onSubmit)}>
        <Grid columnSpacing={{ xs: 1, sm: 2, md: 3 }} container rowSpacing={1}>
          <Grid size={{ xs: 12 }}>
            <FormGroup>
              <Active defaultChecked={ticker?.active} />
            </FormGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormGroup>
              <Title />
            </FormGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormGroup>
              <Description />
            </FormGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography component="h6" variant="h6">
              Information
            </Typography>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Author />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Url />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Email />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Twitter />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Facebook />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Threads />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Instagram />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Telegram />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Mastodon />
            </FormGroup>
          </Grid>
          <Grid size={{ sm: 6, xs: 12 }}>
            <FormGroup>
              <Bluesky />
            </FormGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
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
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={1}>
              <LocationSearch callback={onLocationChange} />
              <Button disabled={ticker?.location.lat === 0 && ticker.location.lon === 0} onClick={onLoctionReset} variant="outlined">
                Reset
              </Button>
            </Stack>
          </Grid>
          {position.lat !== 0 && position.lon !== 0 ? (
            <Grid size={{ xs: 12 }}>
              <MapContainer center={[position.lat, position.lon]} scrollWheelZoom={false} style={{ height: 200 }} zoom={10}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[position.lat, position.lon]} />
              </MapContainer>
            </Grid>
          ) : null}
        </Grid>
      </form>
    </FormProvider>
  )
}

export default TickerForm
