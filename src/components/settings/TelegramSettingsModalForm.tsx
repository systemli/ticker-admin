import { FC } from 'react'
import { Setting, TelegramSetting } from '../../api/Settings'
import SettingsModalForm from './SettingsModalForm'
import TelegramSettingsForm from './TelegramSettingsForm'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<TelegramSetting>
  onSaved?: () => void
}

const TelegramSettingsModalForm: FC<Props> = ({ open, onClose, setting, onSaved }) => {
  return (
    <SettingsModalForm open={open} onClose={onClose} title="settings.telegram.edit" formId="telegramSettingForm">
      {({ setSubmitting }) => (
        <TelegramSettingsForm callback={onClose} name="telegramSettingForm" setting={setting} setSubmitting={setSubmitting} onSaved={onSaved} />
      )}
    </SettingsModalForm>
  )
}

export default TelegramSettingsModalForm
