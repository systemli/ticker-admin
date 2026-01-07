import { Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { FC } from 'react'
import useAuth from '../../contexts/useAuth'
import useUsersQuery from '../../queries/useUsersQuery'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'
import UserListItems from './UserListItems'
import { useTranslation } from 'react-i18next'

const UserList: FC = () => {
  const { t } = useTranslation()
  const { token } = useAuth()
  const { isLoading, error, data } = useUsersQuery({ token })

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error') {
    return <ErrorView queryKey={['users']}>{t("user.errorUnableToFetch")}</ErrorView>
  }

  const users = data.data?.users || []

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" size="small">
              {t('common.ID')}
            </TableCell>
            <TableCell align="center" size="small">
              {t('common.admin')}
            </TableCell>
            <TableCell align="left" size="medium">
              {t('user.email')}
            </TableCell>
            <TableCell align="left" size="small" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
              {t('common.creationTime')}
            </TableCell>
            <TableCell align="left" size="small" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
              {t('user.lastLogin')}
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
