import React, { FC, useCallback, useState } from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'
import { Ticker } from '../api/Ticker'
import TickerForm from './TickerForm'

interface Props {
  ticker?: Ticker
  trigger: React.ReactNode
}

const TickerModalForm: FC<Props> = props => {
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
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      trigger={props.trigger}
    >
      {' '}
      <Header>
        {props.ticker ? `Edit ${props.ticker.title}` : 'Create Ticker'}
      </Header>
      <Modal.Content>
        <TickerForm callback={handleClose} ticker={props.ticker} />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            color="green"
            content={props.ticker ? 'Save' : 'Create'}
            form="editTicker"
            type="submit"
          />
          <Button.Or />
          <Button color="red" content="Close" onClick={handleClose} />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default TickerModalForm
