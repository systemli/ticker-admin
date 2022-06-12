import React, { FC } from 'react'
import { Table } from 'semantic-ui-react'
import { User } from '../api/User'
import UserListItem from './UserListItem'

interface Props {
  users: Array<User>
}

const UserListItems: FC<Props> = ({ users }: Props) => {
  return (
    <Table.Body>
      {users.map(user => (
        <UserListItem key={user.id} user={user} />
      ))}
    </Table.Body>
  )
}

export default UserListItems
