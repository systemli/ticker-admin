import { Grid } from '@mui/material'
import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import BlueskyCard from './BlueskyCard'
import MastodonCard from './MastodonCard'
import SignalGroupCard from './SignalGroupCard'
import TelegramCard from './TelegramCard'
import WebsiteCard from './WebsiteCard'

interface Props {
  ticker: Ticker
}

const TickerIntegrations: FC<Props> = ({ ticker }) => {
  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <WebsiteCard ticker={ticker} />
      </Grid>
      <Grid item md={6} xs={12}>
        <MastodonCard ticker={ticker} />
      </Grid>
      <Grid item md={6} xs={12}>
        <TelegramCard ticker={ticker} />
      </Grid>
      <Grid item md={6} xs={12}>
        <BlueskyCard ticker={ticker} />
      </Grid>
      <Grid item md={6} xs={12}>
        <SignalGroupCard ticker={ticker} />
      </Grid>
    </Grid>
  )
}

export default TickerIntegrations
