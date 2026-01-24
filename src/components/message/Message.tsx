import { Close } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, useTheme } from '@mui/material'
import { FC, useState } from 'react'
import { Message as MessageType } from '../../api/Message'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import MessageAttachements from './MessageAttachments'
import MessageFooter from './MessageFooter'
import MessageModalDelete from './MessageModalDelete'

// Configure marked to support GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false,
})

interface Props {
  message: MessageType
}

const Message: FC<Props> = ({ message }) => {
  const theme = useTheme()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

  // Process the description with Markdown and sanitize the result
  const processedMessage = message.text ?
    DOMPurify.sanitize(marked.parse(message.text)) : null

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
        {processedMessage && (
          <Box
            sx={{ paddingRight: theme.spacing(6) }}
            dangerouslySetInnerHTML={{ __html: processedMessage }}
          />
        )}
        <MessageAttachements message={message} />
        <MessageFooter message={message} />
      </CardContent>
    </Card>
  )
}

export default Message
