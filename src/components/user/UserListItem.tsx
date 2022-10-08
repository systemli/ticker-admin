import React, { FC } from 'react'
import Moment from 'react-moment'
import { Button, Icon, Label, Table } from 'semantic-ui-react'
import { User } from '../../api/User'
import UserModalDelete from './UserModalDelete'
import UserModalForm from './UserModalForm'

interface Props {
  user: User
}

const UserListItem: FC<Props> = props => {
  const user = props.user

  return (
    <Table.Row>
      <Table.Cell>{user.id}</Table.Cell>
      <Table.Cell>
        <Label color={user.is_super_admin ? 'yellow' : 'green'}>
          <Icon name={user.is_super_admin ? 'check circle' : 'remove circle'} />
          {user.is_super_admin ? 'Yes' : 'No'}
        </Label>
      </Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>
        <Moment date={user.creation_date} fromNow />
      </Table.Cell>
      <Table.Cell textAlign="right">
        <Button.Group size="small">
          <UserModalForm
            trigger={<Button color="black" content="Edit" icon="edit" />}
            user={user}
          />
          <UserModalDelete
            trigger={<Button color="red" content="Delete" icon="delete" />}
            user={user}
          />
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  )
}

export default UserListItem
