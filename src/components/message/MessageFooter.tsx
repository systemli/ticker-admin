import { FC } from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faMastodon, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Link, Stack, Typography, useTheme } from '@mui/material'
import { Message } from '../../api/Message'
import dayjs from 'dayjs'

interface Props {
  message: Message
}

const MessageFooter: FC<Props> = ({ message }) => {
  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between">
      <Box>
        <Typography variant="caption">{dayjs(message.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
      </Box>
      <Box>
        <Icon icon={faTelegram} url={message.telegramUrl} />
        <Icon icon={faMastodon} url={message.mastodonUrl} />
      </Box>
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
      <FontAwesomeIcon icon={icon} />
    </Link>
  ) : null
}

export default MessageFooter
