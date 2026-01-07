import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import BlueskyForm from './BlueskyForm'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const BlueskyModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const { t } = useTranslation()

  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureBluesky" title={t("integrations.bluesky.configure")}>
      <BlueskyForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default BlueskyModalForm
