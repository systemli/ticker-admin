import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User } from '../../api/User'
import Modal from '../common/Modal'
import UserForm from './UserForm'

interface Props {
  onClose: () => void
  open: boolean
  user?: User
}

const UserModalForm: FC<Props> = ({ open, onClose, user }) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  return (
    <Modal submitting={submitting} fullWidth={true} onClose={onClose} open={open} submitForm="userForm" title={t(user ? 'user.update' : 'user.create')}>
      <UserForm callback={onClose} id="userForm" user={user} setSubmitting={setSubmitting} />
    </Modal>
  )
}

export default UserModalForm
