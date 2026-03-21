import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, CardActions, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type IntegrationStatus = 'active' | 'inactive' | 'configured' | 'notConfigured'

interface IntegrationCardProps {
  icon: IconDefinition
  title: string
  description: string
  status: IntegrationStatus
  details: ReactNode | null
  actions: ReactNode
  children?: ReactNode
}

const statusConfig: Record<IntegrationStatus, { color?: 'success' | 'warning' }> = {
  active: { color: 'success' },
  inactive: { color: 'warning' },
  configured: { color: 'success' },
  notConfigured: {},
}

const IntegrationCard: FC<IntegrationCardProps> = ({ icon, title, description, status, details, actions, children }) => {
  const { t } = useTranslation()

  const { color } = statusConfig[status]

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1}>
            <Typography component="h5" variant="h5">
              <FontAwesomeIcon icon={icon} /> {title}
            </Typography>
            <Chip label={t(`integrations.integrationStatus.${status}`)} color={color} size="small" variant="outlined" />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        </CardContent>
        <Divider variant="middle" />
        <CardContent sx={{ flexGrow: 1 }}>
          {details !== null ? (
            details
          ) : (
            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
              {t('integrations.notConfiguredHint')}
            </Typography>
          )}
        </CardContent>
        <Divider variant="middle" />
        <CardActions>{actions}</CardActions>
      </Card>
      {children}
    </>
  )
}

export default IntegrationCard
