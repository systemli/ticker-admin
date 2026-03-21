import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'

interface IntegrationModalFormProps {
  open: boolean
  onClose: () => void
  ticker: Ticker
  formId: string
  titleKey: string
  FormComponent: FC<{ callback: () => void; ticker: Ticker }>
}

const IntegrationModalForm: FC<IntegrationModalFormProps> = ({ open, onClose, ticker, formId, titleKey, FormComponent }) => {
  const { t } = useTranslation()

  return (
    <Modal maxWidth="sm" onClose={onClose} open={open} submitForm={formId} title={t(titleKey)}>
      <FormComponent callback={onClose} ticker={ticker} />
    </Modal>
  )
}

export default IntegrationModalForm
