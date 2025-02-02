import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { Ticker, putTickerResetApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TickerResetModal: FC<Props> = ({ onClose, open, ticker }) => {
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleReset = useCallback(() => {
    putTickerResetApi(token, ticker)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['messages', ticker.id] })
        queryClient.invalidateQueries({ queryKey: ['tickerUsers', ticker.id] })
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
      })
      .finally(() => {
        createNotification({ content: 'Ticker has been successfully reset', severity: 'success' })
        onClose()
      })
  }, [token, ticker, queryClient, createNotification, onClose])

  return (
    <Modal dangerActionButtonText="Reset" onClose={onClose} onDangerAction={handleReset} open={open} title="Reset Ticker">
      <p>
        <strong>Are you sure you want to reset the ticker?</strong>
      </p>
      <p>This will remove all messages, descriptions and disable the ticker.</p>
    </Modal>
  )
}

export default TickerResetModal
