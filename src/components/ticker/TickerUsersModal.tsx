import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import TickerUsersForm from './TickerUsersForm'
import Modal from '../common/Modal'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
  users: User[]
}

const TickerUsersModal: FC<Props> = ({ onClose, open, ticker, users }) => {
  const { t } = useTranslation()

  return (
    <Modal fullWidth={true} onClose={onClose} open={open} submitForm="tickerUsersForm" title={t("user.manageAccess")}>
      <TickerUsersForm defaultValue={users} onSubmit={onClose} ticker={ticker} />
    </Modal>
  )
}

export default TickerUsersModal
