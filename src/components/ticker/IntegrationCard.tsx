import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faGear, faPause, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, CardActions, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type IntegrationStatus = 'active' | 'inactive' | 'configured' | 'notConfigured'

interface IntegrationCardProps {
  icon: IconDefinition
  title: string
  description: string
  status: IntegrationStatus
  details: ReactNode | null
  children?: ReactNode
  // Standard actions (used by most cards)
  connected?: boolean
  active?: boolean
  onToggle?: () => void
  onDelete?: () => void
  onConfigure?: () => void
  // Custom actions (used by SignalGroup)
  actions?: ReactNode
}

const statusConfig: Record<IntegrationStatus, { color?: 'success' | 'warning' }> = {
  active: { color: 'success' },
  inactive: { color: 'warning' },
  configured: { color: 'success' },
  notConfigured: {},
}

const IntegrationCard: FC<IntegrationCardProps> = ({
  icon,
  title,
  description,
  status,
  details,
  children,
  connected,
  active,
  onToggle,
  onDelete,
  onConfigure,
  actions,
}) => {
  const { t } = useTranslation()

  const { color } = statusConfig[status]

  const renderActions = () => {
    if (actions) return actions

    return (
      <>
        {connected && onToggle ? (
          active ? (
            <Button onClick={onToggle} size="small" startIcon={<FontAwesomeIcon icon={faPause} />}>
              {t('action.disable')}
            </Button>
          ) : (
            <Button onClick={onToggle} size="small" startIcon={<FontAwesomeIcon icon={faPlay} />}>
              {t('action.enable')}
            </Button>
          )
        ) : null}
        {onConfigure ? (
          <Button onClick={onConfigure} size="small" startIcon={<FontAwesomeIcon icon={faGear} />}>
            {t('action.configure')}
          </Button>
        ) : null}
        {connected && onDelete ? (
          <Button onClick={onDelete} size="small" startIcon={<FontAwesomeIcon icon={faTrash} />}>
            {t('action.delete')}
          </Button>
        ) : null}
      </>
    )
  }

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
        <CardActions>{renderActions()}</CardActions>
      </Card>
      {children}
    </>
  )
}

export default IntegrationCard
