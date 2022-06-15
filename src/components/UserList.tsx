import React, { FC } from 'react'
import { Button, Dimmer, Loader, Table } from 'semantic-ui-react'
import { getUsers } from '../api/User'
import { useQuery } from 'react-query'
import UserListItems from './UserListItems'
import UserModalForm from './UserModalForm'

const UserList: FC = () => {
  const { isLoading, error, data } = useQuery('users', getUsers, {
    refetchInterval: false,
  })

  if (isLoading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    )
  }

  if (error || data === undefined) {
    //TODO: Generic Error View
    return <React.Fragment>Error occured</React.Fragment>
  }

  const users = data.data.users

  return (
    <React.Fragment>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Admin</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Creation Time</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <UserListItems users={users} />
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell>
              <UserModalForm
                trigger={
                  <Button
                    content="Create"
                    floated="right"
                    icon="user"
                    primary
                    size="small"
                  />
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </React.Fragment>
  )
}

export default UserList