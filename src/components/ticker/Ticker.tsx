import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert, Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { Ticker as Model } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import Loader from '../Loader'
import MessageForm from '../message/MessageForm'
import MessageList from '../message/MessageList'
import TickerCard from './TickerCard'
import TickerDangerZoneCard from './TickerDangerZoneCard'
import TickerModalForm from './TickerModalForm'
import TickerUsersCard from './TickerUsersCard'

interface Props {
  ticker?: Model
  isLoading: boolean
}

const Ticker: FC<Props> = ({ ticker, isLoading }) => {
  const { user } = useAuth()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)

  const headline = () => (
    <Stack alignItems="center" direction="row" justifyContent="space-between" mb={2}>
      <Typography component="h2" gutterBottom variant="h3">
        Ticker
      </Typography>
      <Button
        onClick={() => {
          setFormModalOpen(true)
        }}
        startIcon={<FontAwesomeIcon icon={faGear} />}
        variant="contained"
      >
        Configure
      </Button>
      <TickerModalForm
        onClose={() => {
          setFormModalOpen(false)
        }}
        open={formModalOpen}
        ticker={ticker}
      />
    </Stack>
  )

  if (ticker === undefined || isLoading) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {headline()}
        </Grid>
        <Grid item xs={12}>
          <Loader />
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {headline()}
      </Grid>
      {!ticker.active ? (
        <Grid item xs={12}>
          <Alert severity="warning">This ticker is currently disabled.</Alert>
        </Grid>
      ) : null}
      <Grid display={{ xs: 'none', md: 'block' }} item md={4} spacing={2} xs={12}>
        <TickerCard ticker={ticker} />
        {user?.roles.includes('admin') ? (
          <>
            <Box sx={{ mt: 2 }}>
              <TickerUsersCard ticker={ticker} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TickerDangerZoneCard ticker={ticker} />
            </Box>
          </>
        ) : null}
      </Grid>
      <Grid container item md={8} rowSpacing={2} xs={12}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <MessageForm ticker={ticker} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <MessageList ticker={ticker} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Ticker
