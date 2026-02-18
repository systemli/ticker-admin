import { Grid } from '@mui/material'
import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import useFeature from '../../contexts/useFeature'
import BlueskyCard from './BlueskyCard'
import MastodonCard from './MastodonCard'
import SignalGroupCard from './SignalGroupCard'
import TelegramCard from './TelegramCard'
import WebsiteCard from './WebsiteCard'

interface Props {
  ticker: Ticker
}

const TickerIntegrations: FC<Props> = ({ ticker }) => {
  const { features } = useFeature()

  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 6, xs: 12 }}>
        <WebsiteCard ticker={ticker} />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <MastodonCard ticker={ticker} />
      </Grid>
      {features.telegramEnabled ? (
        <Grid size={{ md: 6, xs: 12 }}>
          <TelegramCard ticker={ticker} />
        </Grid>
      ) : null}
      <Grid size={{ md: 6, xs: 12 }}>
        <BlueskyCard ticker={ticker} />
      </Grid>
      {features.signalGroupEnabled ? (
        <Grid size={{ md: 6, xs: 12 }}>
          <SignalGroupCard ticker={ticker} />
        </Grid>
      ) : null}
    </Grid>
  )
}

export default TickerIntegrations
