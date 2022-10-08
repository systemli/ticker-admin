import React, { FC, useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Confirm } from 'semantic-ui-react'
import { User, useUserApi } from '../api/User'
import useAuth from './useAuth'

interface Props {
  user: User
  trigger: React.ReactNode
}

const UserModalDelete: FC<Props> = props => {
  const { token } = useAuth()
  const { deleteUser } = useUserApi(token!)
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const user = props.user

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleConfirm = useCallback(() => {
    deleteUser(user).finally(() => {
      queryClient.invalidateQueries(['users'])
      setOpen(false)
    })
  }, [deleteUser, user, queryClient])

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

export default UserModalDelete
