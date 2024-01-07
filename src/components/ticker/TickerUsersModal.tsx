import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import TickerUsersForm from './TickerUsersForm'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
  users: User[]
}

const TickerUsersModal: FC<Props> = ({ onClose, open, ticker, users }) => {
  return (
    <Modal fullWidth={true} onClose={onClose} open={open} submitForm="tickerUsersForm" title="Manage User Access">
      <TickerUsersForm defaultValue={users} onSubmit={onClose} ticker={ticker} />
    </Modal>
  )
}

export default TickerUsersModal
