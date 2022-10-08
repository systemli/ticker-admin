import React, { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { useQuery } from 'react-query'
import {
  Button,
  Card,
  Dimmer,
  Header,
  Icon,
  List,
  Loader,
} from 'semantic-ui-react'
import { useSettingsApi } from '../api/Settings'
import ErrorView from '../views/ErrorView'
import InactiveSettingsModalForm from './InactiveSettingsModalForm'
import useAuth from './useAuth'

const InactiveSettingsCard: FC = () => {
  const { token } = useAuth()
  const { getInactiveSettings } = useSettingsApi(token)
  const { isLoading, error, data } = useQuery(
    'inactive_settings',
    getInactiveSettings,
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
    return <ErrorView>Unable to fetch inactive settings from server.</ErrorView>
  }

  const setting = data.data.setting

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          <Icon name="question circle" />
          Inactive Settings
        </Card.Header>
        <Card.Meta>
          These settings have affect for inactive or non-configured tickers.
        </Card.Meta>
      </Card.Content>
      <Card.Content>
        <Card.Description>
          <List>
            <List.Item>
              <List.Header>Headline</List.Header>
              {setting.value.headline}
            </List.Item>
            <List.Item>
              <List.Header>Subheadline</List.Header>
              {setting.value.sub_headline}
            </List.Item>
            <List.Item>
              <List.Header>Description</List.Header>
              <ReactMarkdown>{setting.value.description}</ReactMarkdown>
            </List.Item>
          </List>
          <Header size="medium">Information</Header>
          <List>
            <List.Item>
              <List.Icon name="users" />
              <List.Content>{setting.value.author}</List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="mail" />
              <List.Content>{setting.value.email}</List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="linkify" />
              <List.Content>{setting.value.homepage}</List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="twitter" />
              <List.Content>{setting.value.twitter}</List.Content>
            </List.Item>
          </List>
        </Card.Description>
      </Card.Content>
      <Card.Content>
        <InactiveSettingsModalForm
          setting={setting}
          trigger={<Button color="black" content="edit" icon="edit" />}
        />
      </Card.Content>
    </Card>
  )
}

export default InactiveSettingsCard
