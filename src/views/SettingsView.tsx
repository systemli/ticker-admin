import { Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { FC } from 'react'
import InactiveSettingsCard from '../components/settings/InactiveSettingsCard'
import Layout from './Layout'

const SettingsView: FC = () => {
  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Stack alignItems="center" direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" gutterBottom variant="h3">
              Settings
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>
          <InactiveSettingsCard />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default SettingsView
