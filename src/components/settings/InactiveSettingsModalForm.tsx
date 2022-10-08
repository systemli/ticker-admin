import React, { FC, useCallback, useState } from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'
import { InactiveSetting, Setting } from '../../api/Settings'
import InactiveSettingsForm from './InactiveSettingsForm'

interface Props {
  setting: Setting<InactiveSetting>
  trigger: React.ReactNode
}

const InactiveSettingsModalForm: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  return (
    <Modal
      closeIcon
      dimmer
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      size="small"
      trigger={props.trigger}
    >
      <Header>Edit Inactive Settings</Header>
      <Modal.Content>
        <InactiveSettingsForm callback={handleClose} setting={props.setting} />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            color="green"
            content="Update"
            form="inactiveSettingsForm"
            type="submit"
          />
          <Button.Or />
          <Button color="red" content="Close" onClick={handleClose} />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default InactiveSettingsModalForm
