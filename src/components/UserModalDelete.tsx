import React, { FC, useCallback, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Confirm } from 'semantic-ui-react'
import { deleteUser, User } from '../api/User'

interface Props {
  user: User
  trigger: React.ReactNode
}

const UserModalDelete: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const user = props.user

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleConfirm = useCallback(() => {
    deleteUser(user).finally(() => {
      queryClient.invalidateQueries('users')
    })
  }, [user, queryClient])

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
