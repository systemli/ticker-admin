import { FC, useState } from 'react'
import TickerList from '../components/ticker/TickerList'
import useAuth from '../components/useAuth'
import Layout from './Layout'
import { Button, Card, Grid, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import TickerModalForm from '../components/ticker/TickerModalForm'

const HomeView: FC = () => {
  const { user } = useAuth()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack alignItems="center" direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" gutterBottom variant="h3">
              Tickers
            </Typography>
            {user?.roles.includes('admin') ? (
              <>
                <Button
                  onClick={() => {
                    setFormModalOpen(true)
                  }}
                  startIcon={<FontAwesomeIcon icon={faPlus} />}
                  variant="contained"
                >
                  New Ticker
                </Button>
                <TickerModalForm
                  onClose={() => {
                    setFormModalOpen(false)
                  }}
                  open={formModalOpen}
                />
              </>
            ) : null}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TickerList />
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default HomeView
