import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import TelegramForm from './TelegramForm'
import Modal from '../common/Modal'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TelegramModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const { t } = useTranslation()

  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureTelegram" title={t('integrations.telegram.configure')}>
      <TelegramForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default TelegramModalForm
