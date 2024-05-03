import { FC, useCallback } from 'react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TickerResetModal: FC<Props> = ({ onClose, open, ticker }) => {
  const { token } = useAuth()
  const { putTickerReset } = useTickerApi(token)
  const queryClient = useQueryClient()

  const handleReset = useCallback(() => {
    putTickerReset(ticker)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['messages', ticker.id] })
        queryClient.invalidateQueries({ queryKey: ['tickerUsers', ticker.id] })
        queryClient.invalidateQueries({ queryKey: ['ticker', ticker.id] })
      })
      .finally(() => {
        onClose()
      })
  }, [onClose, putTickerReset, queryClient, ticker])

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
