import { FC, useState } from 'react'
import { User } from '../../api/User'
import Modal from '../common/Modal'
import UserForm from './UserForm'

interface Props {
  onClose: () => void
  open: boolean
  user?: User
}

const UserModalForm: FC<Props> = ({ open, onClose, user }) => {
  const [submitting, setSubmitting] = useState(false)
  return (
    <Modal submitting={submitting} fullWidth={true} onClose={onClose} open={open} submitForm="userForm" title={user ? 'Update User' : 'Create User'}>
      <UserForm callback={onClose} id="userForm" user={user} setSubmitting={setSubmitting} />
    </Modal>
  )
}

export default UserModalForm
