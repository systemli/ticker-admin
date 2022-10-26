import React, { FC } from 'react'
import { TableBody } from '@mui/material'
import { User } from '../../api/User'
import UserListItem from './UserListItem'

interface Props {
  users: Array<User>
}

const UserListItems: FC<Props> = ({ users }: Props) => {
  return (
    <TableBody>
      {users.map(user => (
        <UserListItem key={user.id} user={user} />
      ))}
    </TableBody>
  )
}

export default UserListItems
