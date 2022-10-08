import React, { FC } from 'react'
import { List } from 'semantic-ui-react'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import TickerUsersListItem from './TickerUserListItem'

interface Props {
  ticker: Ticker
  users: User[] | null
}

const TickerUserList: FC<Props> = props => {
  if (props.users === null || props.users.length === 0) {
    return (
      <React.Fragment>
        There are no users granted access this ticker.
      </React.Fragment>
    )
  }

  return (
    <List divided relaxed verticalAlign="middle">
      {props.users.map(user => (
        <TickerUsersListItem key={user.id} ticker={props.ticker} user={user} />
      ))}
    </List>
  )
}

export default TickerUserList
