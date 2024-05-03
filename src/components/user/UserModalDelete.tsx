import { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { User, useUserApi } from '../../api/User'
import useAuth from '../../contexts/useAuth'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  user: User
}

const UserModalDelete: FC<Props> = ({ onClose, open, user }) => {
  const { token } = useAuth()
  const { deleteUser } = useUserApi(token)
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    deleteUser(user).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
    })
  }, [deleteUser, user, queryClient, onClose])

  return (
    <Modal dangerActionButtonText="Delete" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete User">
      Are you sure to delete the user? This action cannot be undone.
    </Modal>
  )
}

export default UserModalDelete
