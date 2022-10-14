import { useQueryClient } from '@tanstack/react-query'
import React, { FC, useCallback } from 'react'
import { Button, Card, Container, Icon } from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import TelegramModalForm from './TelegramModalForm'

interface Props {
  ticker: Ticker
}

const TelegramCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { deleteTickerTelegram, putTickerTelegram } = useTickerApi(token)
  const queryClient = useQueryClient()

  const telegram = ticker.telegram

  const handleToggle = useCallback(() => {
    putTickerTelegram({ active: !telegram.active }, ticker).finally(() =>
      queryClient.invalidateQueries(['ticker', ticker.id])
    )
  }, [putTickerTelegram, queryClient, telegram.active, ticker])

  const handleDisconnect = useCallback(() => {
    deleteTickerTelegram(ticker).finally(() => {
      queryClient.invalidateQueries(['ticker', ticker.id])
    })
  }, [deleteTickerTelegram, queryClient, ticker])

  return telegram.connected ? (
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
          <Button.Group compact size="tiny">
            {telegram.active ? (
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
