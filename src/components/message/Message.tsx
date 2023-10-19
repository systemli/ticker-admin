import React, { FC, useState } from 'react'
import { Message as MessageType } from '../../api/Message'
import { replaceMagic } from '../../lib/replaceLinksHelper'
import MessageModalDelete from './MessageModalDelete'
import MessageMap from './MessageMap'
import { Ticker } from '../../api/Ticker'
import { Card, CardContent, IconButton, useTheme } from '@mui/material'
import MessageAttachements from './MessageAttachments'
import MessageFooter from './MessageFooter'
import { Close } from '@mui/icons-material'

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
        <p
          dangerouslySetInnerHTML={{
            __html: replaceMagic(message.text),
          }}
          style={{ paddingRight: theme.spacing(6) }}
        />
        <MessageAttachements message={message} />
        <MessageMap message={message} ticker={ticker} />
        <MessageFooter message={message} />
      </CardContent>
    </Card>
  )
}

export default Message
