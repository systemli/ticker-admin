import React, { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import UserListItems from './UserListItems'
import useAuth from '../useAuth'
import { useUserApi } from '../../api/User'
import ErrorView from '../../views/ErrorView'
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Loader from '../Loader'

const UserList: FC = () => {
  const { token } = useAuth()
  const { getUsers } = useUserApi(token)
  const { isLoading, error, data } = useQuery(['users'], getUsers)

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error') {
    return <ErrorView>Unable to fetch users from server.</ErrorView>
  }

  const users = data.data.users

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" size="small">
              ID
            </TableCell>
            <TableCell align="center" size="small">
              Admin
            </TableCell>
            <TableCell align="left" size="medium">
              E-Mail
            </TableCell>
            <TableCell
              align="left"
              size="small"
              sx={{ display: { xs: 'none', md: 'table-cell' } }}
            >
              Creation Time
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <UserListItems users={users} />
      </Table>
    </TableContainer>
  )
}

export default UserList
