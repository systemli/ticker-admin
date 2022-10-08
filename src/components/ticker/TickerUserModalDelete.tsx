import React, { FC, useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Confirm } from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import { User } from '../../api/User'
import useAuth from '../useAuth'

interface Props {
  ticker: Ticker
  user: User
  trigger: React.ReactNode
}

const TickerUserModalDelete: FC<Props> = ({ ticker, trigger, user }) => {
  const { token } = useAuth()
  const { deleteTickerUser } = useTickerApi(token)
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleConfirm = useCallback(() => {
    deleteTickerUser(ticker, user).finally(() => {
      queryClient.invalidateQueries(['tickerUsers', ticker.id])
      setOpen(false)
    })
  }, [deleteTickerUser, ticker, user, queryClient])

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
      trigger={trigger}
    />
  )
}

export default TickerUserModalDelete
