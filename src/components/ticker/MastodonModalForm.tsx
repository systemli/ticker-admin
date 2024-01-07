import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import MastodonForm from './MastodonForm'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const MastodonModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureMastodon" title="Configure Mastodon">
      <MastodonForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default MastodonModalForm
