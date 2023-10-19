import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Message, useMessageApi } from '../../api/Message'
import useAuth from '../useAuth'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  message: Message
}
const MessageModalDelete: FC<Props> = ({ message, onClose, open }) => {
  const { token } = useAuth()
  const { deleteMessage } = useMessageApi(token)
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    deleteMessage(message).then(() => {
      queryClient.invalidateQueries(['messages', message.ticker])
      onClose()
    })
  }, [deleteMessage, message, onClose, queryClient])

  return (
    <Modal dangerActionButtonText="Delete" maxWidth="sm" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete Message">
      Are you sure to delete the message? This action cannot be undone.
    </Modal>
  )
}

export default MessageModalDelete
