import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import SignalGroupForm from './SignalGroupForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const SignalGroupModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureSignalGroup" title="Configure Signal Group">
      <SignalGroupForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default SignalGroupModalForm
