import React, { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Dimmer, Loader } from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import TickerUserList from './TickerUserList'
import TickerUserModalAdd from './TickerUserModalAdd'
import useAuth from '../useAuth'

interface Props {
  ticker: Ticker
}

const TickerUsersCard: FC<Props> = props => {
  const { token } = useAuth()
  const { getTickerUsers } = useTickerApi(token)
  const { isLoading, error, data } = useQuery(
    ['tickerUsers', props.ticker.id],
    () => {
      return getTickerUsers(props.ticker)
    },
    {
      refetchInterval: false,
    }
  )

  if (isLoading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    )
  }

  if (error || data === undefined) {
    //TODO: Generic Error View
    return <React.Fragment>Error occured</React.Fragment>
  }

  const users = data.data.users

  return (
    <Card fluid>
      <Card.Content>
        List of all granted users to this ticker. Only Admins can manage this
        list.
      </Card.Content>
      <Card.Content>
        <TickerUserList ticker={props.ticker} users={users} />
      </Card.Content>
      <Card.Content extra>
        <TickerUserModalAdd
          ticker={props.ticker}
          trigger={
            <Button color="teal" compact content="Add" icon="add" size="tiny" />
          }
          users={users}
        />
      </Card.Content>
    </Card>
  )
}

export default TickerUsersCard
