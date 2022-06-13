import React, { FC } from 'react'
import { useHistory } from 'react-router'
import { Button, Icon, Table } from 'semantic-ui-react'
import { Ticker } from '../api/Ticker'
import { User } from '../api/User'
import TickerModalDelete from './TickerModalDelete'
import TickerModalForm from './TickerModalForm'

interface Props {
  ticker: Ticker
  user: User
}

const TickerListItem: FC<Props> = ({ ticker, user }: Props) => {
  const history = useHistory()

  return (
    <Table.Row key={ticker.id}>
      <Table.Cell collapsing>
        <Icon
          color={ticker.active ? 'green' : 'red'}
          name={ticker.active ? 'toggle on' : 'toggle off'}
          size={'large'}
        />
      </Table.Cell>
      <Table.Cell>{ticker.title}</Table.Cell>
      <Table.Cell>{ticker.domain}</Table.Cell>
      <Table.Cell collapsing textAlign="right">
        <Button.Group size="small">
          <Button
            color="teal"
            content="Use"
            icon="rocket"
            onClick={() => history.push(`/ticker/${ticker.id}`)}
            ticker={ticker}
          />
          <TickerModalForm
            ticker={ticker}
            trigger={<Button color="black" content="Edit" icon="edit" />}
          />
          {user.is_super_admin ? (
            <TickerModalDelete
              ticker={ticker}
              trigger={<Button color="red" content="Delete" icon="delete" />}
            />
          ) : null}
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  )
}

export default TickerListItem
