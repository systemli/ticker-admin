import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import BlueskyForm from './BlueskyForm'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const BlueskyModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureBluesky" title="Configure Bluesky">
      <BlueskyForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default BlueskyModalForm
