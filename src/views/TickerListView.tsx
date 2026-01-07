import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, Grid, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TickerList from '../components/ticker/TickerList'
import TickerModalForm from '../components/ticker/TickerModalForm'
import useAuth from '../contexts/useAuth'
import Layout from './Layout'

const TickerListView: FC = () => {
  const { t } = useTranslation()
  const { token, user } = useAuth()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Stack alignItems="center" direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" gutterBottom variant="h3">
              {t('title.tickers')}
            </Typography>
            {user?.roles.includes('admin') ? (
              <Button
                onClick={() => {
                  setFormModalOpen(true)
                }}
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                variant="contained"
              >
                {t('tickers.new')}
              </Button>
            ) : null}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <TickerList token={token} />
          </Card>
        </Grid>
      </Grid>
      {user?.roles.includes('admin') && (
        <TickerModalForm
          onClose={() => {
            setFormModalOpen(false)
          }}
          open={formModalOpen}
        />
      )}
    </Layout>
  )
}

export default TickerListView
