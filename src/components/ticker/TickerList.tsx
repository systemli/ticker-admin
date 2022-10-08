import React, { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import { Button, Table } from 'semantic-ui-react'
import TickerModalForm from './TickerModalForm'
import TickerListItems from './TickerListItems'
import useAuth from '../useAuth'

interface Props {
  tickers: Ticker[]
}

const TickerList: FC<Props> = props => {
  const { user } = useAuth()

  return (
    <React.Fragment>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Domain</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <TickerListItems tickers={props.tickers} />
        {user?.roles.includes('admin') ? (
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell>
                <TickerModalForm
                  trigger={
                    <Button
                      color="green"
                      content="Create Ticker"
                      floated="right"
                      icon="plus"
                      labelPosition="left"
                      size="small"
                    />
                  }
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        ) : null}
      </Table>
    </React.Fragment>
  )
}

export default TickerList
