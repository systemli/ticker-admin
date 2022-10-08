import React, { FC } from 'react'
import { Button, Card, Container, Icon } from 'semantic-ui-react'
import { Ticker } from '../../api/Ticker'
import TelegramModalForm from './TelegramModalForm'

interface Props {
  ticker: Ticker
}

const TelegramCard: FC<Props> = ({ ticker }) => {
  const telegram = ticker.telegram

  return telegram.active ? (
    <Container>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Icon color="green" name="toggle on" />
            {telegram.channel_name}
          </Card.Header>
          <Card.Meta>Bot: {telegram.bot_username}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <TelegramModalForm
            ticker={ticker}
            trigger={
              <Button
                color="blue"
                compact
                content="Configure"
                icon="telegram"
                size="tiny"
              />
            }
          />
        </Card.Content>
      </Card>
    </Container>
  ) : (
    <Container>
      <Card fluid>
        <Card.Content>
          You are currently not connected to Telegram. New messages will not be
          published to your channel.
        </Card.Content>
        <Card.Content extra>
          <TelegramModalForm
            ticker={ticker}
            trigger={
              <Button
                color="blue"
                compact
                content="Configure"
                icon="telegram"
                size="tiny"
              />
            }
          />
        </Card.Content>
      </Card>
    </Container>
  )
}

export default TelegramCard
