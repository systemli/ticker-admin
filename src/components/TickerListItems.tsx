import React, { FC } from 'react'
import { Table } from 'semantic-ui-react'
import { Ticker } from '../api/Ticker'
import TickerListItem from './TickerListItem'

interface Props {
  tickers: Array<Ticker>
}

const TickerListItems: FC<Props> = ({ tickers }: Props) => {
  return (
    <Table.Body>
      {tickers.map(ticker => (
        <TickerListItem key={ticker.id} ticker={ticker} />
      ))}
    </Table.Body>
  )
}

export default TickerListItems
