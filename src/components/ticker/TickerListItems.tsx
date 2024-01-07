import { TableBody } from '@mui/material'
import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import TickerListItem from './TickerListItem'

interface Props {
  tickers: Array<Ticker>
}

const TickerListItems: FC<Props> = ({ tickers }: Props) => {
  return (
    <TableBody>
      {tickers.map(ticker => (
        <TickerListItem key={ticker.id} ticker={ticker} />
      ))}
    </TableBody>
  )
}

export default TickerListItems
