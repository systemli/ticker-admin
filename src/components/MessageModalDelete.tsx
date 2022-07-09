import React, { FC, useCallback, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Confirm } from 'semantic-ui-react'
import { Message, useMessageApi } from '../api/Message'
import useAuth from './useAuth'

interface Props {
  message: Message
  trigger: React.ReactNode
}

const MessageModalDelete: FC<Props> = props => {
  const { token } = useAuth()
  const { deleteMessage } = useMessageApi(token)
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const tickerId = props.message.ticker.toString()
  const messageId = props.message.id.toString()

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleConfirm = useCallback(() => {
    deleteMessage(tickerId, messageId).finally(() => {
      queryClient.invalidateQueries(['messages', tickerId])
    })
  }, [deleteMessage, tickerId, messageId, queryClient])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  return (
    <Confirm
      dimmer
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      onOpen={handleOpen}
      open={open}
      size="mini"
      trigger={props.trigger}
    />
  )
}

export default MessageModalDelete
