import { faShieldDog, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { Ticker } from '../../api/Ticker'
import useAuth from '../../contexts/useAuth'
import useTickerUsersQuery from '../../queries/useTickerUsersQuery'
import ErrorView from '../../views/ErrorView'
import Loader from '../Loader'
import TickerUserList from './TickerUserList'
import TickerUsersModal from './TickerUsersModal'

interface Props {
  ticker: Ticker
}

const TickerUsersCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const { isLoading, error, data } = useTickerUsersQuery({ ticker, token })

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.data === undefined || data.status === 'error') {
    return <ErrorView queryKey={['tickerUsers', ticker.id]}>Unable to fetch users from server.</ErrorView>
  }

  const users = data.data.users

  return (
    <Card>
      <CardContent>
        <Typography component="h5" sx={{ mb: 2 }} variant="h5">
          <FontAwesomeIcon icon={faUsers} /> Users
        </Typography>
        <Typography variant="body2">List of all granted users to this ticker. Only Admins can manage this list.</Typography>
        <TickerUserList ticker={ticker} users={users} />
        <Button onClick={() => setFormOpen(true)} startIcon={<FontAwesomeIcon icon={faShieldDog} />} variant="outlined">
          Manage Users
        </Button>
        <TickerUsersModal onClose={() => setFormOpen(false)} open={formOpen} ticker={ticker} users={users} />
      </CardContent>
    </Card>
  )
}

export default TickerUsersCard
