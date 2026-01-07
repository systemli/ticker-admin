import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import WebsiteForm from './WebsiteForm'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const WebsiteModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const { t } = useTranslation()

  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureWebsites" title={t("integrations.website.configure")}>
      <WebsiteForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default WebsiteModalForm
