import React, { FC } from 'react'
import { getTickers } from '../api/Ticker'
import { Button, Dimmer, Loader, Table } from 'semantic-ui-react'
import TickerModalForm from './TickerModalForm'
import { useQuery } from 'react-query'
import TickerListItems from './TickerListItems'
import useAuth from './useAuth'

const TickerList: FC = () => {
  const { user } = useAuth()
  const { isLoading, error, data } = useQuery('tickers', getTickers, {
    refetchInterval: false,
  })

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

  const tickers = data.data.tickers

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
        <TickerListItems tickers={tickers} />
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
