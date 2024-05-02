import { CircularProgress, Stack, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { FC } from 'react'
import { GetTickersQueryParams, useTickerApi } from '../../api/Ticker'
import TickerListItem from './TickerListItem'
import useAuth from '../useAuth'
import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'

interface Props {
  params: GetTickersQueryParams
}

const TickerListItems: FC<Props> = ({ params }: Props) => {
  const { token, user } = useAuth()
  const { getTickers } = useTickerApi(token)
  const { isFetching, error, data } = useQuery({
    queryKey: ['tickers', params],
    queryFn: () => getTickers(params),
    placeholderData: previousData => previousData,
  })

  if (data === undefined && isFetching) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <Stack alignItems="center" justifyContent="center">
              <CircularProgress size="2rem" />
              <Typography component="span" sx={{ pt: 1 }}>
                Loading
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (error || data === undefined || data.status === 'error') {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <Typography variant="body1">Unable to fetch tickers from server.</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (data.status === 'success' && data.data.tickers.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <Stack alignItems="center" justifyContent="center">
              <Typography variant="body1">No tickers found.</Typography>
            </Stack>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  const tickers = data.data.tickers

  if (tickers.length === 1 && !user?.roles.includes('admin')) {
    return <Navigate replace to={`/ticker/${tickers[0].id}`} />
  }

  return (
    <TableBody>
      {tickers.map(ticker => (
        <TickerListItem key={ticker.id} ticker={ticker} />
      ))}
    </TableBody>
  )
}

export default TickerListItems
