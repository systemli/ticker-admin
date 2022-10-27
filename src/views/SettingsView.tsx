import React, { FC } from 'react'
import Layout from './Layout'
import { Grid, Stack, Typography } from '@mui/material'
import RefreshIntervalCard from '../components/settings/RefreshIntervalCard'
import InactiveSettingsCard from '../components/settings/InactiveSettingsCard'

const SettingsView: FC = () => {
  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            mb={2}
          >
            <Typography component="h2" gutterBottom variant="h3">
              Settings
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <InactiveSettingsCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <RefreshIntervalCard />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default SettingsView
