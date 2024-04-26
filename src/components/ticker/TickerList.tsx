import { FC } from 'react'
import { useTickerApi } from '../../api/Ticker'
import TickerListItems from './TickerListItems'
import useAuth from '../useAuth'
import { useQuery } from '@tanstack/react-query'
import Loader from '../Loader'
import ErrorView from '../../views/ErrorView'
import { Navigate } from 'react-router'
import { Card, CardContent, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const TickerList: FC = () => {
  const { token, user } = useAuth()
  const { getTickers } = useTickerApi(token)
  const { isLoading, error, data } = useQuery({ queryKey: ['tickers'], queryFn: getTickers })

  if (isLoading) {
    return <Loader />
  }

  if (error || data === undefined || data.status === 'error') {
    return <ErrorView queryKey={['tickers']}>Unable to fetch tickers from server.</ErrorView>
  }

  const tickers = data.data.tickers

  if (tickers.length === 0) {
    if (user?.roles.includes('admin')) {
      return (
        <Card>
          <CardContent>
            <Typography component="h2" variant="h4">
              Welcome!
            </Typography>
            <Typography sx={{ mt: 2 }} variant="body1">
              There are no tickers yet. To start with a ticker, create one.
            </Typography>
          </CardContent>
        </Card>
      )
    } else {
      return (
        <Card>
          <CardContent>
            <Typography component="h2" variant="h4">
              Oh no! Something unexpected happened
            </Typography>
            <Typography sx={{ mt: 2 }} variant="body1">
              Currently there are no tickers for you. Contact your administrator if that should be different.
            </Typography>
          </CardContent>
        </Card>
      )
    }
  }

  if (tickers.length === 1 && !user?.roles.includes('admin')) {
    return <Navigate replace to={`/ticker/${tickers[0].id}`} />
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" size="small">
              Active
            </TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Domain</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TickerListItems tickers={tickers} />
      </Table>
    </TableContainer>
  )
}

export default TickerList
