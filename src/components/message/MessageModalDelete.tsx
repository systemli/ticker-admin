import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { Message, deleteMessageApi } from '../../api/Message'
import useAuth from '../../contexts/useAuth'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  message: Message
}
const MessageModalDelete: FC<Props> = ({ message, onClose, open }) => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    deleteMessageApi(token, message).then(() => {
      queryClient.invalidateQueries({ queryKey: ['messages', message.ticker] })
      onClose()
    })
  }, [message, onClose, queryClient, token])

  return (
    <Modal dangerActionButtonText="Delete" maxWidth="sm" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete Message">
      Are you sure to delete the message? This action cannot be undone.
    </Modal>
  )
}

export default MessageModalDelete
