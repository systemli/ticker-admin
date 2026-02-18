import { Grid, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import InactiveSettingsCard from '../components/settings/InactiveSettingsCard'
import SignalGroupSettingsCard from '../components/settings/SignalGroupSettingsCard'
import TelegramSettingsCard from '../components/settings/TelegramSettingsCard'
import useFeature from '../contexts/useFeature'
import Layout from './Layout'

const SettingsView: FC = () => {
  const { t } = useTranslation()
  const { refreshFeatures } = useFeature()

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Stack alignItems="center" direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" gutterBottom variant="h3">
              {t('title.settings')}
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>
          <InactiveSettingsCard />
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>
          <TelegramSettingsCard onSaved={refreshFeatures} />
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>
          <SignalGroupSettingsCard onSaved={refreshFeatures} />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default SettingsView
