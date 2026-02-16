import { FC, useState } from 'react'
import { Setting, TelegramSetting } from '../../api/Settings'
import Modal from '../common/Modal'
import TelegramSettingsForm from './TelegramSettingsForm'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<TelegramSetting>
  onSaved?: () => void
}

const TelegramSettingsModalForm: FC<Props> = ({ open, onClose, setting, onSaved }) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Modal submitting={submitting} fullWidth={true} onClose={onClose} open={open} submitForm="telegramSettingForm" title={t('settings.telegram.edit')}>
      <TelegramSettingsForm callback={onClose} name="telegramSettingForm" setting={setting} setSubmitting={setSubmitting} onSaved={onSaved} />
    </Modal>
  )
}

export default TelegramSettingsModalForm
