import { Close } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, useTheme } from '@mui/material'
import { FC, useState } from 'react'
import { Message as MessageType } from '../../api/Message'
import { Ticker } from '../../api/Ticker'
import Links from './Links'
import MessageAttachements from './MessageAttachments'
import MessageFooter from './MessageFooter'
import MessageMap from './MessageMap'
import MessageModalDelete from './MessageModalDelete'

interface Props {
  message: MessageType
  ticker: Ticker
}

const Message: FC<Props> = ({ message, ticker }) => {
  const theme = useTheme()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <IconButton
          onClick={() => {
            setDeleteModalOpen(true)
          }}
          sx={{ position: 'absolute', right: theme.spacing(3) }}
        >
          <Close />
        </IconButton>
        <MessageModalDelete message={message} onClose={() => setDeleteModalOpen(false)} open={deleteModalOpen} />
        {message.text.split(/\r\n|\r|\n/g).map((line, i) => (
          <Box key={message.id + i} style={{ paddingRight: theme.spacing(6) }}>
            <Links message={line} />
          </Box>
        ))}
        <MessageAttachements message={message} />
        <MessageMap message={message} ticker={ticker} />
        <MessageFooter message={message} />
      </CardContent>
    </Card>
  )
}

export default Message
