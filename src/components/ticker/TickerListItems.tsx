import { CircularProgress, Stack, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { FC } from 'react'
import { GetTickersQueryParams } from '../../api/Ticker'
import useTickersQuery from '../../queries/useTickersQuery'
import TickerListItem from './TickerListItem'
import { useTranslation } from 'react-i18next'

interface Props {
  token: string
  params: GetTickersQueryParams
}

const TickerListItems: FC<Props> = ({ token, params }) => {
  const { t } = useTranslation()
  const { data, isLoading, error } = useTickersQuery({ token, params: params })
  const tickers = data?.data?.tickers || []

  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <Stack alignItems="center" justifyContent="center">
              <CircularProgress size="2rem" />
              <Typography component="span" sx={{ pt: 1 }}>
                {t('common.loading')}
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (error || data === undefined || data.data === undefined || data.status === 'error') {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <Typography variant="body1">{t("tickers.errorUnableToFetch")}</Typography>
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
              <Typography variant="body1">{t("tickers.error0Found")}</Typography>
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
