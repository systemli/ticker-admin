import { Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { FC } from 'react'
import useAuth from '../../contexts/useAuth'
import useUsersQuery from '../../queries/useUsersQuery'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'
import UserListItems from './UserListItems'

const UserList: FC = () => {
  const { token } = useAuth()
  const { isLoading, error, data } = useUsersQuery({ token })

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error') {
    return <ErrorView queryKey={['users']}>Unable to fetch users from server.</ErrorView>
  }

  const users = data.data?.users || []

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
            <TableCell align="left" size="small" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
              Creation Time
            </TableCell>
            <TableCell align="left" size="small" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
              Last Login
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
