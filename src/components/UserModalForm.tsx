import React, { FC, useCallback, useState } from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'
import { User } from '../api/User'
import UserForm from './UserForm'

interface Props {
  user?: User
  trigger: React.ReactNode
}

const UserModalForm: FC<Props> = props => {
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
      <Header>{props.user ? 'Edit User' : 'Create User'}</Header>
      <Modal.Content>
        <UserForm callback={handleClose} user={props.user} />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            color="green"
            content={props.user ? 'Update' : 'Create'}
            form="userForm"
            type="submit"
          />
          <Button.Or />
          <Button color="red" content="Close" onClick={handleClose} />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default UserModalForm
