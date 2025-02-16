import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBluesky, faMastodon, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { colors, Link, Stack, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { FC } from 'react'
import { Message } from '../../api/Message'

interface Props {
  message: Message
}

const MessageFooter: FC<Props> = ({ message }) => {
  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ mt: 2, pr: 2.5 }}>
      <Stack alignItems="center" direction="row" spacing={0.5}>
        <FontAwesomeIcon icon={faClock} size="2xs" color={colors.grey[600]} />
        <Typography variant="caption">{dayjs(message.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
      </Stack>
      <Stack alignItems="center" direction="row" spacing="0.5">
        <Icon icon={faTelegram} url={message.telegramUrl} />
        <Icon icon={faMastodon} url={message.mastodonUrl} />
        <Icon icon={faBluesky} url={message.blueskyUrl} />
      </Stack>
    </Stack>
  )
}

interface IconProps {
  url?: string
  icon: IconProp
}

const Icon: FC<IconProps> = ({ url, icon }) => {
  const theme = useTheme()

  return url ? (
    <Link href={url} rel="noopener noreferrer" style={{ marginLeft: theme.spacing(1) }} target="_blank">
      <FontAwesomeIcon icon={icon} size="sm" color={colors.grey[600]} />
    </Link>
  ) : null
}

export default MessageFooter
