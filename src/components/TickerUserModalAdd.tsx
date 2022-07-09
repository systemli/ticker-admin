import React, { FC, useCallback, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { Ticker } from '../api/Ticker'
import { User } from '../api/User'
import TickerUserAddForm from './TickerUserAddForm'

interface Props {
  ticker: Ticker
  trigger: React.ReactNode
  users: User[]
}

const TickerUserModalAdd: FC<Props> = props => {
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
      <Modal.Header>Add Users</Modal.Header>
      <Modal.Content>
        <TickerUserAddForm
          callback={handleClose}
          ticker={props.ticker}
          users={props.users}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            color="green"
            content="Add"
            form="tickerUsersForm"
            type="submit"
          />
          <Button.Or />
          <Button color="red" content="Close" onClick={handleClose} />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default TickerUserModalAdd
