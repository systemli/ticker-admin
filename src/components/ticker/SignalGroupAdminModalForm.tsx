import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import SignalGroupAdminForm from './SignalGroupAdminForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const SignalGroupAdminModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureSignalGroupAdmin" title="Add admin members">
      <SignalGroupAdminForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default SignalGroupAdminModalForm
