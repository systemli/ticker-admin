import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBluesky, faMastodon, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { colors, Link, Stack, Typography, useTheme } from '@mui/material'
import { FC } from 'react'
import { Message } from '../../api/Message'

interface Props {
  message: Message
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const MessageFooter: FC<Props> = ({ message }) => {
  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ mt: 2, pr: 2.5 }}>
      <Stack alignItems="center" direction="row" spacing={0.5}>
        <FontAwesomeIcon aria-hidden="true" icon={faClock} size="2xs" color={colors.grey[600]} />
        <Typography variant="caption">{formatDate(message.createdAt)}</Typography>
      </Stack>
      <Stack alignItems="center" direction="row" spacing="0.5">
        <Icon icon={faTelegram} url={message.telegramUrl} label="Telegram" />
        <Icon icon={faMastodon} url={message.mastodonUrl} label="Mastodon" />
        <Icon icon={faBluesky} url={message.blueskyUrl} label="Bluesky" />
      </Stack>
    </Stack>
  )
}

interface IconProps {
  url?: string
  icon: IconProp
  label: string
}

const Icon: FC<IconProps> = ({ url, icon, label }) => {
  const theme = useTheme()

  return url ? (
    <Link href={url} rel="noopener noreferrer" style={{ marginLeft: theme.spacing(1) }} target="_blank" aria-label={label}>
      <FontAwesomeIcon aria-hidden="true" icon={icon} size="sm" color={colors.grey[600]} />
    </Link>
  ) : null
}

export default MessageFooter
