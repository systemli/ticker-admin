import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { Ticker, deleteTickerApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TickerModalDelete: FC<Props> = ({ open, onClose, ticker }) => {
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    deleteTickerApi(token, ticker).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['tickers'] })
      createNotification({ content: 'Ticker was successfully deleted', severity: 'success' })
    })
  }, [token, ticker, queryClient, createNotification])

  return (
    <Modal dangerActionButtonText="Delete" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete Ticker">
      Are you sure to delete the ticker? This action cannot be undone.
    </Modal>
  )
}

export default TickerModalDelete
