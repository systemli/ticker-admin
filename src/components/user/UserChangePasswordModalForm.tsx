import { FC, useState } from 'react'
import Modal from '../common/Modal'
import UserChangePasswordForm from './UserChangePasswordForm'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onClose: () => void
}

const UserChangePasswordModalForm: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Modal submitting={submitting} onClose={onClose} open={open} submitForm="changePasswordForm" title={t('user.changePassword')}>
      <UserChangePasswordForm id="changePasswordForm" onClose={onClose} setSubmitting={setSubmitting} />
    </Modal>
  )
}

export default UserChangePasswordModalForm
