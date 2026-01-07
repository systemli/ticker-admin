import { FC, useState } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import SignalGroupAdminForm from './SignalGroupAdminForm'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const SignalGroupAdminModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureSignalGroupAdmin" title={t("integrations.signal.addAdmin")} submitting={submitting}>
      <SignalGroupAdminForm callback={onClose} ticker={ticker} setSubmitting={setSubmitting} />
    </Modal>
  )
}

export default SignalGroupAdminModalForm
