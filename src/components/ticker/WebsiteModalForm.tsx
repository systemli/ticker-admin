import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import WebsiteForm from './WebsiteForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const WebsiteModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureWebsites" title="Configure Websites">
      <WebsiteForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default WebsiteModalForm
