import { FC, useState } from 'react'
import { InactiveSetting, Setting } from '../../api/Settings'
import Modal from '../common/Modal'
import InactiveSettingsForm from './InactiveSettingsForm'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<InactiveSetting>
}

const InactiveSettingsModalForm: FC<Props> = ({ open, onClose, setting }) => {
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Modal submitting={submitting} fullWidth={true} onClose={onClose} open={open} submitForm="inactiveSettingForm" title="Edit Inactive Settings">
      <InactiveSettingsForm callback={onClose} name="inactiveSettingForm" setting={setting} setSubmitting={setSubmitting} />
    </Modal>
  )
}

export default InactiveSettingsModalForm
