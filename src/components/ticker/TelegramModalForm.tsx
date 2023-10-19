import React, { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import TelegramForm from './TelegramForm'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TelegramModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureTelegram" title="Configure Telegram">
      <TelegramForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default TelegramModalForm
