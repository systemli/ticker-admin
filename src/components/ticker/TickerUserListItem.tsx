import React, { FC } from 'react'
import { Button, List } from 'semantic-ui-react'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import TickerUserModalDelete from './TickerUserModalDelete'

interface Props {
  ticker: Ticker
  user: User
}

const TickerUsersListItem: FC<Props> = props => {
  return (
    <List.Item key={props.user.id}>
      <List.Content floated="right">
        <TickerUserModalDelete
          ticker={props.ticker}
          trigger={
            <Button
              basic
              color="red"
              compact
              content="Remove"
              icon="delete"
              size="tiny"
            />
          }
          user={props.user}
        />
      </List.Content>
      <List.Icon name="user" size="large" verticalAlign="middle" />
      <List.Content>{props.user.email}</List.Content>
    </List.Item>
  )
}

export default TickerUsersListItem
