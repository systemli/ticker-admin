import { FC } from 'react'
import { Navigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import Loader from '../components/Loader'
import useAuth from '../contexts/useAuth'
import useTickersQuery from '../queries/useTickersQuery'
import ErrorView from './ErrorView'
import Layout from './Layout'
import TickerListView from './TickerListView'

const HomeView: FC = () => {
  const { token, user } = useAuth()
  const [params] = useSearchParams()
  const { data, error, isLoading } = useTickersQuery({
    token,
    params: {
      order_by: params.get('order_by') ?? 'id',
      sort: params.get('sort') === 'asc' ? 'asc' : 'desc',
      title: params.get('title') ?? undefined,
      domain: params.get('domain') ?? undefined,
      active: params.get('active') === 'true' ? true : params.get('active') === 'false' ? false : undefined,
    },
  })

  if (isLoading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <ErrorView queryKey={['tickers']}>
          <p>Unable to fetch tickers from server.</p>
        </ErrorView>
      </Layout>
    )
  }

  const tickers = data?.data?.tickers || []

  if (!user?.roles.includes('admin') && tickers.length === 1) {
    return <Navigate replace to={`/ticker/${tickers[0].id}`} />
  }

  return <TickerListView />
}

export default HomeView
