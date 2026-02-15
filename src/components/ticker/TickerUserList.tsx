import { MenuList, Typography } from '@mui/material'
import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import { User } from '../../api/User'
import TickerUsersListItem from './TickerUserListItem'
import { useTranslation } from 'react-i18next'

interface Props {
  ticker: Ticker
  users: User[]
}

const TickerUserList: FC<Props> = ({ ticker, users }) => {
  const { t } = useTranslation()

  if (users.length === 0) {
    return <Typography sx={{ my: 2 }}>{t('user.errorAccess')}</Typography>
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
