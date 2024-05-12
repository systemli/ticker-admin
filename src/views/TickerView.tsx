import { FC } from 'react'
import { useParams } from 'react-router-dom'
import Ticker from '../components/ticker/Ticker'
import useAuth from '../contexts/useAuth'
import useTickerQuery from '../queries/useTickerQuery'
import ErrorView from './ErrorView'
import Layout from './Layout'

interface TickerViewParams {
  tickerId: string
}

const TickerView: FC = () => {
  const { tickerId } = useParams<keyof TickerViewParams>() as TickerViewParams
  const tickerIdNum = parseInt(tickerId)
  const { token } = useAuth()
  const { data, isLoading, error } = useTickerQuery({ id: tickerIdNum, token })

  if (error !== null || data?.status === 'error') {
    return (
      <Layout>
        <ErrorView queryKey={['ticker']}>
          <p>Ticker not found.</p>
        </ErrorView>
      </Layout>
    )
  }

  const ticker = data?.data.ticker

  return (
    <Layout>
      <Ticker ticker={ticker} isLoading={isLoading} />
    </Layout>
  )
}

export default TickerView
