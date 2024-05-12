import { CircularProgress, Stack, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { FC } from 'react'
import { GetTickersQueryParams } from '../../api/Ticker'
import useTickersQuery from '../../queries/useTickersQuery'
import TickerListItem from './TickerListItem'

interface Props {
  token: string
  params: GetTickersQueryParams
}

const TickerListItems: FC<Props> = ({ token, params }) => {
  const { data, isLoading, error } = useTickersQuery({ token, params: params })
  const tickers = data?.data.tickers || []

  if (isLoading) {
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

  if (error) {
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

  if (tickers.length === 0) {
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

  return (
    <TableBody>
      {tickers.map(ticker => (
        <TickerListItem key={ticker.id} ticker={ticker} />
      ))}
    </TableBody>
  )
}

export default TickerListItems
