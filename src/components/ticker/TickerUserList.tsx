import { MenuList, Typography } from '@mui/material'
import React, { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import TickerUsersListItem from './TickerUserListItem'

interface Props {
  ticker: Ticker
  users: User[]
}

const TickerUserList: FC<Props> = ({ ticker, users }) => {
  if (users.length === 0) {
    return (
      <Typography variant="body2">
        There are no users granted access this ticker.
      </Typography>
    )
  }

  return (
    <MenuList>
      {users.map(user => (
        <TickerUsersListItem key={user.id} ticker={ticker} user={user} />
      ))}
    </MenuList>
  )
}

export default TickerUserList
