import React, { FC, useCallback, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { Ticker } from '../../api/Ticker'
import MastodonForm from './MastodonForm'

interface Props {
  ticker: Ticker
  trigger: React.ReactNode
}

const MastodonModalForm: FC<Props> = ({ ticker, trigger }) => {
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
      <Modal.Header>Configure Mastodon</Modal.Header>
      <Modal.Content>
        <MastodonForm callback={handleClose} ticker={ticker} />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            color="green"
            content="Save"
            form="configureMastodon"
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

export default MastodonModalForm
