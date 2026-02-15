import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { User, deleteUserApi } from '../../api/User'
import useAuth from '../../contexts/useAuth'
import Modal from '../common/Modal'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  user: User
}

const UserModalDelete: FC<Props> = ({ onClose, open, user }) => {
  const { t } = useTranslation()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    deleteUserApi(token, user).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
    })
  }, [token, user, queryClient, onClose])

  return (
    <Modal dangerActionButtonText="Delete" onClose={onClose} onDangerAction={handleDelete} open={open} title={t('user.delete')}>
      {t('user.questionPermanentDelete')}
    </Modal>
  )
}

export default UserModalDelete
