import React, { FC, useCallback, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Confirm } from 'semantic-ui-react'
import { deleteTicker, Ticker } from '../api/Ticker'

interface Props {
  ticker: Ticker
  trigger: React.ReactNode
}

const TickerModalDelete: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const ticker = props.ticker

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleConfirm = useCallback(() => {
    deleteTicker(ticker.id).finally(() => {
      queryClient.invalidateQueries('tickers')
    })
  }, [ticker, queryClient])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  return (
    <Confirm
      dimmer
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      onOpen={handleOpen}
      open={open}
      size="mini"
      trigger={props.trigger}
    />
  )
}

export default TickerModalDelete
