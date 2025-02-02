import { useQueryClient } from '@tanstack/react-query'
import { FC, useCallback } from 'react'
import { handleApiCall } from '../../api/Api'
import { Ticker, deleteTickerUserApi } from '../../api/Ticker'
import { User } from '../../api/User'
import useAuth from '../../contexts/useAuth'
import useNotification from '../../contexts/useNotification'
import Modal from '../common/Modal'

interface Props {
  ticker: Ticker
  user: User
  open: boolean
  onClose: () => void
}

const TickerUserModalDelete: FC<Props> = ({ open, onClose, ticker, user }) => {
  const { createNotification } = useNotification()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const handleDelete = useCallback(() => {
    handleApiCall(deleteTickerUserApi(token, ticker, user), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tickerUsers', ticker.id] })
        createNotification({ content: 'User is successfully deleted from ticker', severity: 'success' })
        onClose()
      },
      onError: () => {
        createNotification({ content: 'Failed to delete user from ticker', severity: 'error' })
      },
      onFailure: error => {
        createNotification({ content: error as string, severity: 'error' })
      },
    })
  }, [token, ticker, user, queryClient, createNotification, onClose])

  return (
    <Modal dangerActionButtonText="Delete" onClose={onClose} onDangerAction={handleDelete} open={open} title="Delete User from Ticker">
      Are you sure to remove <strong>{user.email}</strong> from this ticker?
    </Modal>
  )
}

export default TickerUserModalDelete
