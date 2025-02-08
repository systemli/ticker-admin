import { FC, useState } from 'react'
import { RefreshIntervalSetting, Setting } from '../../api/Settings'
import Modal from '../common/Modal'
import RefreshIntervalForm from './RefreshIntervalForm'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<RefreshIntervalSetting>
}

const RefreshIntervalModalForm: FC<Props> = ({ open, onClose, setting }) => {
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Modal submitting={submitting} fullWidth={true} onClose={onClose} open={open} submitForm="refreshIntervalForm" title="Edit Refresh Interval">
      <RefreshIntervalForm callback={onClose} name="refreshIntervalForm" setting={setting} setSubmitting={setSubmitting} />
    </Modal>
  )
}

export default RefreshIntervalModalForm
