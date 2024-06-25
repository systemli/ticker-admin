import { FC, useState } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import SignalGroupForm from './SignalGroupForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const SignalGroupModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureSignalGroup" title="Configure Signal Group" submitting={submitting}>
      <SignalGroupForm callback={onClose} ticker={ticker} setSubmitting={setSubmitting} />
    </Modal>
  )
}

export default SignalGroupModalForm
