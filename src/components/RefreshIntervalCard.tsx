import React, { FC } from 'react'
import { useQuery } from 'react-query'
import { Button, Card, Dimmer, Icon, List, Loader } from 'semantic-ui-react'
import { useSettingsApi } from '../api/Settings'
import ErrorView from '../views/ErrorView'
import RefreshIntervalModalForm from './RefreshIntervalModalForm'
import useAuth from './useAuth'

const RefreshIntervalCard: FC = () => {
  const { token } = useAuth()
  const { getRefreshInterval } = useSettingsApi(token)
  const { isLoading, error, data } = useQuery(
    'refresh_interval_setting',
    getRefreshInterval,
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
    return (
      <ErrorView>
        Unable to fetch refresh interval setting from server.
      </ErrorView>
    )
  }

  const setting = data.data.setting

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          <Icon name="refresh" />
          Refresh Interval
        </Card.Header>
        <Card.Meta>
          These setting configures the reload interval for the frontend
        </Card.Meta>
      </Card.Content>
      <Card.Content>
        <Card.Description>
          <List>
            <List.Item>
              <List.Icon name="rocket" />
              <List.Content>{setting.value} ms</List.Content>
            </List.Item>
          </List>
        </Card.Description>
      </Card.Content>
      <Card.Content>
        <RefreshIntervalModalForm
          setting={setting}
          trigger={<Button color="black" content="edit" icon="edit" />}
        />
      </Card.Content>
    </Card>
  )
}

export default RefreshIntervalCard
