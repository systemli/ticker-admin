import { FC } from 'react'
import { Setting, SignalGroupSetting } from '../../api/Settings'
import SettingsModalForm from './SettingsModalForm'
import SignalGroupSettingsForm from './SignalGroupSettingsForm'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<SignalGroupSetting>
  onSaved?: () => void
}

const SignalGroupSettingsModalForm: FC<Props> = ({ open, onClose, setting, onSaved }) => {
  return (
    <SettingsModalForm open={open} onClose={onClose} title="settings.signalGroup.edit" formId="signalGroupSettingForm">
      {({ setSubmitting }) => (
        <SignalGroupSettingsForm callback={onClose} name="signalGroupSettingForm" setting={setting} setSubmitting={setSubmitting} onSaved={onSaved} />
      )}
    </SettingsModalForm>
  )
}

export default SignalGroupSettingsModalForm
