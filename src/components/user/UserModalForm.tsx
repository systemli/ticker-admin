import React, { FC } from 'react'
import { User } from '../../api/User'
import UserForm from './UserForm'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  user?: User
}

const UserModalForm: FC<Props> = ({ open, onClose, user }) => {
  return (
    <Modal fullWidth={true} onClose={onClose} open={open} submitForm="userForm" title={user ? 'Update User' : 'Create User'}>
      <UserForm callback={onClose} id="userForm" user={user} />
    </Modal>
  )
}

export default UserModalForm
