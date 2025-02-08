import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { handleApiCall } from '../../api/Api'
import { Message, deleteMessageApi } from '../../api/Message'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  message: Message
}
const MessageModalDelete: FC<Props> = ({ message, onClose, open }) => {
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = () => {
    handleApiCall(deleteMessageApi(token, message), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['messages', message.ticker] })
        createNotification({ content: 'Message successfully deleted', severity: 'success' })
        onClose()
      },
      onError: () => {
        createNotification({ content: 'Failed to delete message', severity: 'error' })
      },
      onFailure: () => {
        createNotification({ content: 'Failed to delete message', severity: 'error' })
      },
    })
  }

  return (
    <Modal dangerActionButtonText="Delete" maxWidth="sm" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete Message">
      Are you sure to delete the message? This action cannot be undone.
    </Modal>
  )
}

export default MessageModalDelete
