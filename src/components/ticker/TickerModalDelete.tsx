import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TickerModalDelete: FC<Props> = ({ open, onClose, ticker }) => {
  const { token } = useAuth()
  const { deleteTicker } = useTickerApi(token)
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    deleteTicker(ticker).finally(() => {
      queryClient.invalidateQueries(['tickers'])
    })
  }, [deleteTicker, ticker, queryClient])

  return (
    <Modal
      dangerActionButtonText="Delete"
      onClose={onClose}
      onDangerAction={handleDelete}
      open={open}
      title="Delete Ticker"
    >
      Are you sure to delete the ticker? This action cannot be undone.
    </Modal>
  )
}

export default TickerModalDelete
