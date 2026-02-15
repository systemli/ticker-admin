import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import MastodonForm from './MastodonForm'
import Modal from '../common/Modal'
import { useTranslation } from 'react-i18next'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const MastodonModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const { t } = useTranslation()

  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm="configureMastodon" title={t('integrations.mastodon.configure')}>
      <MastodonForm callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default MastodonModalForm
