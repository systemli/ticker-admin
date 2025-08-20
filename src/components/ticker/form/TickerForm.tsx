import { FormGroup, Grid, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { handleApiCall } from '../../../api/Api'
import { postTickerApi, putTickerApi, Ticker, TickerFormData } from '../../../api/Ticker'
import useAuth from '../../../contexts/useAuth'
import useNotification from '../../../contexts/useNotification'
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
  setSubmitting: (submitting: boolean) => void
}

const TickerForm: FC<Props> = ({ callback, id, ticker, setSubmitting }) => {
  const { createNotification } = useNotification()
  const form = useForm<TickerFormData>({
    defaultValues: {
      title: ticker?.title || '',
      active: ticker?.active || false,
      description: ticker?.description || '',
      information: {
        author: ticker?.information?.author || '',
        email: ticker?.information?.email || '',
        url: ticker?.information?.url || '',
        twitter: ticker?.information?.twitter || '',
        facebook: ticker?.information?.facebook || '',
        threads: ticker?.information?.threads || '',
        instagram: ticker?.information?.instagram || '',
        telegram: ticker?.information?.telegram || '',
        mastodon: ticker?.information?.mastodon || '',
        bluesky: ticker?.information?.bluesky || '',
      },
    },
  })
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const { handleSubmit } = form

  const onSubmit: SubmitHandler<TickerFormData> = data => {
    setSubmitting(true)

    const apiCall = ticker ? putTickerApi(token, data, ticker.id) : postTickerApi(token, data)

    handleApiCall(apiCall, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tickers'] })
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker?.id] })
        createNotification({ content: `Ticker was successfully ${ticker ? 'updated' : 'created'}`, severity: 'success' })
        callback()
      },
      onError: () => {
        createNotification({ content: `Failed to ${ticker ? 'update' : 'create'} ticker`, severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })

    setSubmitting(false)
  }

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
        </Grid>
      </form>
    </FormProvider>
  )
}

export default TickerForm
