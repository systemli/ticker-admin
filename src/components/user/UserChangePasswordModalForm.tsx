import { FC } from 'react'
import Modal from '../common/Modal'
import UserChangePasswordForm from './UserChangePasswordForm'

interface Props {
  open: boolean
  onClose: () => void
}

const UserChangePasswordModalForm: FC<Props> = ({ open, onClose }) => {
  return (
    <Modal onClose={onClose} open={open} submitForm="changePasswordForm" title="Change Password">
      <UserChangePasswordForm id="changePasswordForm" onClose={onClose} />
    </Modal>
  )
}

export default UserChangePasswordModalForm
