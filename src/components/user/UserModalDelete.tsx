import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { User, deleteUserApi } from '../../api/User'
import useAuth from '../../contexts/useAuth'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  user: User
}

const UserModalDelete: FC<Props> = ({ onClose, open, user }) => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    deleteUserApi(token, user).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
    })
  }, [token, user, queryClient, onClose])

  return (
    <Modal dangerActionButtonText="Delete" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete User">
      Are you sure to delete the user? This action cannot be undone.
    </Modal>
  )
}

export default UserModalDelete
