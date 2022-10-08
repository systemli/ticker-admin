import React, { FC } from 'react'
import { Button, Dimmer, Loader, Table } from 'semantic-ui-react'
import { useQuery } from '@tanstack/react-query'
import UserListItems from './UserListItems'
import UserModalForm from './UserModalForm'
import useAuth from '../useAuth'
import { useUserApi } from '../../api/User'
import ErrorView from '../../views/ErrorView'

const UserList: FC = () => {
  const { token } = useAuth()
  const { getUsers } = useUserApi(token)
  const { isLoading, error, data } = useQuery(['users'], getUsers, {
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
    return <ErrorView>Unable to fetch users from server.</ErrorView>
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
