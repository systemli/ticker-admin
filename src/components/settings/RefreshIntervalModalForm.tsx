import React, { FC, useCallback, useState } from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'
import { Setting } from '../../api/Settings'
import RefreshIntervalForm from './RefreshIntervalForm'

interface Props {
  setting: Setting<string>
  trigger: React.ReactNode
}

const RefreshIntervalModalForm: FC<Props> = props => {
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
      <Header>Edit Refresh Interval</Header>
      <Modal.Content>
        <RefreshIntervalForm callback={handleClose} setting={props.setting} />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            color="green"
            content="Update"
            form="refreshIntervalForm"
            type="submit"
          />
          <Button.Or />
          <Button color="red" content="Close" onClick={handleClose} />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default RefreshIntervalModalForm
