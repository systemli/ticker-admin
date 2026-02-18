import { FC, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../common/Modal'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  formId: string
  children: (props: { submitting: boolean; setSubmitting: (submitting: boolean) => void }) => ReactNode
}

const SettingsModalForm: FC<Props> = ({ open, onClose, title, formId, children }) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Modal submitting={submitting} fullWidth={true} onClose={onClose} open={open} submitForm={formId} title={t(title)}>
      {children({ submitting, setSubmitting })}
    </Modal>
  )
}

export default SettingsModalForm
