import React, { FC, useCallback, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Confirm } from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../api/Ticker'
import useAuth from './useAuth'

interface Props {
  ticker: Ticker
  trigger: React.ReactNode
}

const TickerModalDelete: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false)
  const { token } = useAuth()
  const { deleteTicker } = useTickerApi(token)
  const queryClient = useQueryClient()
  const ticker = props.ticker

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleConfirm = useCallback(() => {
    deleteTicker(ticker).finally(() => {
      queryClient.invalidateQueries('tickers')
    })
  }, [deleteTicker, ticker, queryClient])

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
