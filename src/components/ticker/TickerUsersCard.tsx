import React, { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Ticker, useTickerApi } from '../../api/Ticker'
import TickerUserList from './TickerUserList'
import TickerAddUserModal from './TickerAddUserModal'
import useAuth from '../useAuth'
import Loader from '../Loader'
import ErrorView from '../../views/ErrorView'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUsers } from '@fortawesome/free-solid-svg-icons'

interface Props {
  ticker: Ticker
}

const TickerUsersCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { getTickerUsers } = useTickerApi(token)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const { isLoading, error, data } = useQuery(
    ['tickerUsers', ticker.id],
    () => {
      return getTickerUsers(ticker)
    }
  )

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error') {
    return (
      <ErrorView queryKey={['tickerUsers', ticker.id]}>
        Unable to fetch users from server.
      </ErrorView>
    )
  }

  const users = data.data.users

  return (
    <Card>
      <CardContent>
        <Typography component="h5" sx={{ mb: 2 }} variant="h5">
          <FontAwesomeIcon icon={faUsers} /> Users
        </Typography>
        <Typography variant="body2">
          List of all granted users to this ticker. Only Admins can manage this
          list.
        </Typography>
        <TickerUserList ticker={ticker} users={users} />
        <Button
          onClick={() => setFormOpen(true)}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          variant="outlined"
        >
          Add Users
        </Button>
        <TickerAddUserModal
          onClose={() => setFormOpen(false)}
          open={formOpen}
          ticker={ticker}
          users={users}
        />
      </CardContent>
    </Card>
  )
}

export default TickerUsersCard
