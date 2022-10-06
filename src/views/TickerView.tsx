import React, { FC } from 'react'
import { Loader } from 'semantic-ui-react'
import { useTickerApi } from '../api/Ticker'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import useAuth from '../components/useAuth'
import Ticker from '../components/Ticker'

interface TickerViewParams {
  tickerId: string
}

const TickerView: FC = () => {
  const { token } = useAuth()
  const { getTicker } = useTickerApi(token)
  const { tickerId } = useParams<keyof TickerViewParams>() as TickerViewParams
  const tickerIdNum = parseInt(tickerId)

  const { isLoading, error, data } = useQuery(
    ['ticker', tickerIdNum],
    () => getTicker(tickerIdNum),
    { refetchInterval: false }
  )

  if (isLoading) {
    return <Loader size="large" />
  }

  if (error || data === undefined) {
    //TODO: Generic Error View
    return <React.Fragment>Error occured</React.Fragment>
  }

  const ticker = data.data.ticker

  return <Ticker ticker={ticker} />
}

export default TickerView
