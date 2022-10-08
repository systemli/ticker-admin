import React, { FC, useCallback, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { Ticker } from '../../api/Ticker'
import TelegramForm from './TelegramForm'

interface Props {
  ticker: Ticker
  trigger: React.ReactNode
}

const TelegramModalForm: FC<Props> = ({ ticker, trigger }) => {
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
      trigger={trigger}
    >
      <Modal.Header>Configure Telegram</Modal.Header>
      <Modal.Content>
        <TelegramForm callback={handleClose} ticker={ticker} />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            color="green"
            content="Save"
            form="configureTelegram"
            type="submit"
          />
          <Button.Or />
          <Button
            color="red"
            content="Close"
            onClick={handleClose}
            type="button"
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  )
}

export default TelegramModalForm
