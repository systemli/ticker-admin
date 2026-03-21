import { Alert, Grid } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
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

const CARD_MIN_HEIGHT = 220

const TickerIntegrations: FC<Props> = ({ ticker }) => {
  const { t } = useTranslation()
  const { features } = useFeature()

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        {t('integrations.activeIntegrationsInfo')}
      </Alert>
      <Grid container spacing={2}>
        <Grid size={{ md: 6, xs: 12 }} sx={{ minHeight: CARD_MIN_HEIGHT }}>
          <WebsiteCard ticker={ticker} />
        </Grid>
        <Grid size={{ md: 6, xs: 12 }} sx={{ minHeight: CARD_MIN_HEIGHT }}>
          <MastodonCard ticker={ticker} />
        </Grid>
        {features.telegramEnabled ? (
          <Grid size={{ md: 6, xs: 12 }} sx={{ minHeight: CARD_MIN_HEIGHT }}>
            <TelegramCard ticker={ticker} />
          </Grid>
        ) : null}
        <Grid size={{ md: 6, xs: 12 }} sx={{ minHeight: CARD_MIN_HEIGHT }}>
          <BlueskyCard ticker={ticker} />
        </Grid>
        {features.signalGroupEnabled ? (
          <Grid size={{ md: 6, xs: 12 }} sx={{ minHeight: CARD_MIN_HEIGHT }}>
            <SignalGroupCard ticker={ticker} />
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}

export default TickerIntegrations
