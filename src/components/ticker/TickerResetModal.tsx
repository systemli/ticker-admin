import React, { FC, useCallback, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  ticker: Ticker
  trigger: React.ReactNode
}

const TickerResetModal: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false)
  const { token } = useAuth()
  const { putTickerReset } = useTickerApi(token)
  const queryClient = useQueryClient()

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleReset = useCallback(() => {
    putTickerReset(props.ticker)
      .then(() => {
        queryClient.invalidateQueries(['messages', props.ticker.id])
        queryClient.invalidateQueries(['tickerUsers', props.ticker.id])
        queryClient.invalidateQueries(['ticker', props.ticker.id])
      })
      .finally(() => {
        setOpen(false)
      })
  }, [props.ticker, putTickerReset, queryClient])

  return (
    <Modal
      onClose={handleCancel}
      onOpen={handleOpen}
      open={open}
      size="mini"
      trigger={props.trigger}
    >
      <Modal.Header>Reset Ticker</Modal.Header>
      <Modal.Content>
        <p>
          <strong>Are you sure you want to reset the ticker?</strong>
        </p>
        <p>
          This will remove all messages, descriptions, the connection to twitter
          and disable the ticker.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={handleCancel}>
          No
        </Button>
        <Button
          content="Yes"
          icon="checkmark"
          labelPosition="right"
          onClick={handleReset}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default TickerResetModal
