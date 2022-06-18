import React, { FC, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Button, Icon, Table } from 'semantic-ui-react'
import { Ticker } from '../api/Ticker'
import TickerModalDelete from './TickerModalDelete'
import TickerModalForm from './TickerModalForm'
import useAuth from './useAuth'

interface Props {
  ticker: Ticker
}

const TickerListItem: FC<Props> = ({ ticker }: Props) => {
  const { user } = useAuth()
  const navigate = useNavigate()

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
            onClick={useCallback(
              () => navigate(`/ticker/${ticker.id}`),
              [navigate, ticker.id]
            )}
            ticker={ticker}
          />
          <TickerModalForm
            ticker={ticker}
            trigger={<Button color="black" content="Edit" icon="edit" />}
          />
          {user?.roles.includes('admin') ? (
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
