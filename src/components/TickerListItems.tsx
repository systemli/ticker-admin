import React, { FC } from 'react'
import { Table } from 'semantic-ui-react'
import { Ticker } from '../api/Ticker'
import { User } from '../api/User'
import TickerListItem from './TickerListItem'

interface Props {
  tickers: Array<Ticker>
  user: User
}

const TickerListItems: FC<Props> = ({ tickers, user }: Props) => {
  return (
    <Table.Body>
      {tickers.map(ticker => (
        <TickerListItem key={ticker.id} ticker={ticker} user={user} />
      ))}
    </Table.Body>
  )
}

export default TickerListItems
