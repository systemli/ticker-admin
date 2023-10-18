import React, { FC } from 'react'
import { RefreshIntervalSetting, Setting } from '../../api/Settings'
import RefreshIntervalForm from './RefreshIntervalForm'
import Modal from '../common/Modal'

interface Props {
  open: boolean
  onClose: () => void
  setting: Setting<RefreshIntervalSetting>
}

const RefreshIntervalModalForm: FC<Props> = ({ open, onClose, setting }) => {
  return (
    <Modal fullWidth={true} onClose={onClose} open={open} submitForm="refreshIntervalForm" title="Edit Refresh Interval">
      <RefreshIntervalForm callback={onClose} name="refreshIntervalForm" setting={setting} />
    </Modal>
  )
}

export default RefreshIntervalModalForm
