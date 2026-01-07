import { FC } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import Ticker from '../components/ticker/Ticker'
import useAuth from '../contexts/useAuth'
import useTickerQuery from '../queries/useTickerQuery'
import ErrorView from './ErrorView'
import Layout from './Layout'

interface TickerViewParams {
  tickerId: string
}

const TickerView: FC = () => {
  const { t } = useTranslation()
  const { tickerId } = useParams<keyof TickerViewParams>() as TickerViewParams
  const tickerIdNum = parseInt(tickerId)
  const { token } = useAuth()
  const { data, isLoading, error } = useTickerQuery({ id: tickerIdNum, token })

  if (error !== null || data?.status === 'error') {
    return (
      <Layout>
        <ErrorView queryKey={['ticker']}>
          <p>{t('tickers.errorNotFound')}</p>
        </ErrorView>
      </Layout>
    )
  }

  const ticker = data?.data?.ticker

  return (
    <Layout>
      <Ticker ticker={ticker} isLoading={isLoading} />
    </Layout>
  )
}

export default TickerView
