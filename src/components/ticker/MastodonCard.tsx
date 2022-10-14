import { useQueryClient } from '@tanstack/react-query'
import React, { FC, useCallback } from 'react'
import { Button, Card, Container, Icon, Image } from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import MastodonModalForm from './MastodonModalForm'

interface Props {
  ticker: Ticker
}

const MastodonCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { deleteTickerMastodon, putTickerMastodon } = useTickerApi(token)
  const queryClient = useQueryClient()

  const mastodon = ticker.mastodon

  const handleDisconnect = useCallback(() => {
    deleteTickerMastodon(ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
    })
  }, [deleteTickerMastodon, queryClient, ticker])

  const handleToggle = useCallback(() => {
    putTickerMastodon({ active: !mastodon.active }, ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
    })
  }, [mastodon.active, putTickerMastodon, queryClient, ticker])

  const profileLink = (
    <a
      href={mastodon.server + '/web/@' + mastodon.name}
      rel="noreferrer"
      target="_blank"
    >
      @{mastodon.name}@{mastodon.server.replace(/^https?:\/\//, '')}
    </a>
  )

  return mastodon.connected ? (
    <Container>
      <Card fluid>
        <Card.Content>
          {mastodon.image_url != '' && (
            <Image floated="right" size="mini" src={mastodon.image_url} />
          )}
          <Card.Header>
            <Icon
              color={mastodon.active ? 'green' : 'red'}
              name={mastodon.active ? 'toggle on' : 'toggle off'}
            />
            {mastodon.screen_name}
          </Card.Header>
          <Card.Meta>{profileLink}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button.Group compact size="tiny">
            {mastodon.active ? (
              <Button
                color="yellow"
                content="Disable"
                icon="pause"
                onClick={handleToggle}
              />
            ) : (
              <Button
                color="green"
                content="Enable"
                icon="play"
                onClick={handleToggle}
              />
            )}
            <Button
              color="red"
              content="Disconnect"
              icon="delete"
              onClick={handleDisconnect}
            />
          </Button.Group>
        </Card.Content>
      </Card>
    </Container>
  ) : (
    <Container>
      <Card fluid>
        <Card.Content>
          You are currently not connected to Mastodon. New messages will not be
          published to your account and old messages can not be deleted anymore.
        </Card.Content>
        <Card.Content extra>
          <MastodonModalForm
            ticker={ticker}
            trigger={
              <Button
                color="blue"
                compact
                content="Configure"
                icon="server"
                size="tiny"
              />
            }
          />
        </Card.Content>
      </Card>
    </Container>
  )
}

export default MastodonCard
