import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useAuth from '../../contexts/useAuth'
import useInactiveSettingsQuery from '../../queries/useInactiveSettingsQuery'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'
import InactiveSettingsModalForm from './InactiveSettingsModalForm'

const InactiveSettingsCard: FC = () => {
  const { t } = useTranslation()
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const { token } = useAuth()
  const { isLoading, error, data } = useInactiveSettingsQuery({ token })

  const handleFormOpen = () => {
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
  }

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error' || data.data === undefined) {
    return <ErrorView queryKey={['inactive_settings']}>Unable to fetch inactive settings from server.</ErrorView>
  }

  const setting = data.data?.setting

  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component="h3" variant="h5">
            {t('title.inactive')}
          </Typography>
          <Button data-testid="inactivesetting-edit" onClick={handleFormOpen} size="small" startIcon={<FontAwesomeIcon icon={faPencil} />}>
            {t('action.edit')}
          </Button>
        </Stack>
        <Typography component="span" variant="body2" sx={{ color: 'GrayText' }}>
          {t('status.description')}
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography component="span" variant="body2" sx={{ color: 'GrayText' }}>
            {t('common.headline')}
          </Typography>
          <Typography>{setting.value.headline}</Typography>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography component="span" variant="body2" sx={{ color: 'GrayText' }}>
            {t('common.subheadline')}
          </Typography>
          <Typography>{setting.value.subHeadline}</Typography>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography component="span" variant="body2" sx={{ color: 'GrayText' }}>
            {t('common.description')}
          </Typography>
          <Typography>{setting.value.description}</Typography>
        </Box>
        <Grid container>
          <Grid size={{ lg: 6, xs: 12 }}>
            <Box sx={{ mb: 1 }}>
              <Typography component="span" variant="body2" sx={{ color: 'GrayText' }}>
                {t('common.author')}
              </Typography>
              <Typography>{setting.value.author}</Typography>
            </Box>
          </Grid>
          <Grid size={{ lg: 6, xs: 12 }}>
            <Box sx={{ mb: 1 }}>
              <Typography component="span" variant="body2" sx={{ color: 'GrayText' }}>
                {t('integrations.homepage')}
              </Typography>
              <Typography>{setting.value.homepage}</Typography>
            </Box>
          </Grid>
          <Grid size={{ lg: 6, xs: 12 }}>
            <Box sx={{ mb: 1 }}>
              <Typography component="span" variant="body2" sx={{ color: 'GrayText' }}>
                {t('user.email')}
              </Typography>
              <Typography>{setting.value.email}</Typography>
            </Box>
          </Grid>
          <Grid size={{ lg: 6, xs: 12 }}>
            <Box sx={{ mb: 1 }}>
              <Typography component="span" variant="body2" sx={{ color: 'GrayText' }}>
                {t('social.twitter')}
              </Typography>
              <Typography>{setting.value.twitter}</Typography>
            </Box>
          </Grid>
        </Grid>
        <InactiveSettingsModalForm onClose={handleFormClose} open={formOpen} setting={setting} />
      </CardContent>
    </Card>
  )
}

export default InactiveSettingsCard
