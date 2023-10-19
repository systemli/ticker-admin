import React, { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSettingsApi } from '../../api/Settings'
import ErrorView from '../../views/ErrorView'
import useAuth from '../useAuth'
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import Loader from '../Loader'
import RefreshIntervalModalForm from './RefreshIntervalModalForm'

const RefreshIntervalCard: FC = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const { token } = useAuth()
  const { getRefreshInterval } = useSettingsApi(token)
  const { isLoading, error, data } = useQuery(['refresh_interval_setting'], getRefreshInterval)

  const handleFormOpen = () => {
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
  }

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error') {
    return <ErrorView queryKey={['refresh_interval_setting']}>Unable to fetch refresh interval setting from server.</ErrorView>
  }

  const setting = data.data.setting

  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Typography component="h3" variant="h5">
            Refresh Interval
          </Typography>
          <Button data-testid="refreshinterval-edit" onClick={handleFormOpen} size="small" startIcon={<FontAwesomeIcon icon={faPencil} />}>
            Edit
          </Button>
        </Stack>
        <Typography color="GrayText" component="span" variant="body2">
          These settings have affect for inactive or non-configured tickers.
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography color="GrayText" component="span" variant="body2">
            Refresh Interval
          </Typography>
          <Typography>{setting.value} ms</Typography>
        </Box>
        <RefreshIntervalModalForm onClose={handleFormClose} open={formOpen} setting={setting} />
      </CardContent>
    </Card>
  )
}

export default RefreshIntervalCard
