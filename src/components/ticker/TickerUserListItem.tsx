import React, { FC, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Close } from '@mui/icons-material'
import TickerUserModalDelete from './TickerUserModalDelete'

interface Props {
  ticker: Ticker
  user: User
}

const TickerUsersListItem: FC<Props> = ({ ticker, user }) => {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)

  return (
    <ListItem disableGutters disablePadding>
      <ListItemIcon>
        <FontAwesomeIcon icon={faUser} />
      </ListItemIcon>
      <ListItemText>{user.email}</ListItemText>
      <IconButton onClick={() => setDeleteOpen(true)}>
        <Close />
      </IconButton>
      <TickerUserModalDelete onClose={() => setDeleteOpen(false)} open={deleteOpen} ticker={ticker} user={user} />
    </ListItem>
  )
}

export default TickerUsersListItem
