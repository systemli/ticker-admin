import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { handleApiCall } from '../../api/Api'
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
    handleApiCall(deleteTickerApi(token, ticker), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tickers'] })
        createNotification({ content: 'Ticker was successfully deleted', severity: 'success' })
      },
      onError: () => {
        createNotification({ content: 'Failed to delete ticker', severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }, [token, ticker, queryClient, createNotification])

  return (
    <Modal dangerActionButtonText="Delete" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete Ticker">
      Are you sure to delete the ticker? This action cannot be undone.
    </Modal>
  )
}

export default TickerModalDelete
