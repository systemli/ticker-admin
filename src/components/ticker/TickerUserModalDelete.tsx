import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { Ticker, deleteTickerUserApi } from '../../api/Ticker'
import { User } from '../../api/User'
import useAuth from '../../contexts/useAuth'
import Modal from '../common/Modal'

interface Props {
  ticker: Ticker
  user: User
  open: boolean
  onClose: () => void
}

const TickerUserModalDelete: FC<Props> = ({ open, onClose, ticker, user }) => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    deleteTickerUserApi(token, ticker, user).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['tickerUsers', ticker.id] })
      onClose()
    })
  }, [token, ticker, user, queryClient, onClose])

  return (
    <Modal dangerActionButtonText="Delete" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete User from Ticker">
      Are you sure to remove <strong>{user.email}</strong> from this ticker?
    </Modal>
  )
}

export default TickerUserModalDelete
