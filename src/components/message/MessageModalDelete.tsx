import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = () => {
    handleApiCall(deleteMessageApi(token, message), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['messages', message.ticker] })
        createNotification({ content: t('message.deleted'), severity: 'success' })
        onClose()
      },
      onError: () => {
        createNotification({ content: t('message.errorFailedToDelete'), severity: 'error' })
      },
      onFailure: () => {
        createNotification({ content: t('message.errorFailedToDelete'), severity: 'error' })
      },
    })
  }

  return (
    <Modal dangerActionButtonText={t('action.delete')} maxWidth="sm" onClose={onClose} onDangerAction={handleDelete} open={open} title={t('message.delete')}>
      {t('message.questionDelete')}
    </Modal>
  )
}

export default MessageModalDelete
