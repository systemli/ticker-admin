import { FC } from 'react'
import { useParams } from 'react-router-dom'
import Ticker from '../components/ticker/Ticker'
import useAuth from '../contexts/useAuth'
import useTickersQuery from '../queries/tickers'
import ErrorView from './ErrorView'
import Layout from './Layout'

interface TickerViewParams {
  tickerId: string
}

const TickerView: FC = () => {
  const { tickerId } = useParams<keyof TickerViewParams>() as TickerViewParams
  const tickerIdNum = parseInt(tickerId)
  const { token } = useAuth()
  const { data, isLoading, error } = useTickersQuery({ token: token, params: {} })

  if (error !== null || data?.status === 'error') {
    return (
      <Layout>
        <ErrorView queryKey={['tickers']}>
          <p>Ticker not found.</p>
        </ErrorView>
      </Layout>
    )
  }

  const tickers = data?.data.tickers || []
  const ticker = tickers.find(ticker => ticker.id === tickerIdNum)

  return (
    <Layout>
      <Ticker ticker={ticker} isLoading={isLoading} />
    </Layout>
  )
}

export default TickerView
