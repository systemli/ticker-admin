import { FC } from 'react'
import { InactiveSetting, Setting } from '../../api/Settings'
import InactiveSettingsForm from './InactiveSettingsForm'
import Modal from '../common/Modal'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<InactiveSetting>
}

const InactiveSettingsModalForm: FC<Props> = ({ open, onClose, setting }) => {
  return (
    <Modal fullWidth={true} onClose={onClose} open={open} submitForm="inactiveSettingForm" title="Edit Inactive Settings">
      <InactiveSettingsForm callback={onClose} name="inactiveSettingForm" setting={setting} />
    </Modal>
  )
}

export default InactiveSettingsModalForm
