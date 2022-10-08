import React, { FC } from 'react'
import { Button, Grid, Header } from 'semantic-ui-react'
import { Ticker as Model } from '../api/Ticker'
import MessageForm from '../components/MessageForm'
import TickerCard from '../components/TickerCard'
import MessageList from '../components/MessageList'
import useAuth from '../components/useAuth'
import TickerUsersCard from '../components/TickerUserCard'
import TickerResetModal from '../components/TickerResetModal'
import TwitterCard from '../components/TwitterCard'
import TelegramCard from '../components/TelegramCard'
import useFeature from './useFeature'

interface Props {
  ticker: Model
}

const Ticker: FC<Props> = props => {
  const { user } = useAuth()
  const ticker = props.ticker
  const { telegram_enabled, twitter_enabled } = useFeature()

  return (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column width={10}>
          <Header dividing>Messages</Header>
          <MessageForm ticker={ticker} />
          <MessageList ticker={ticker} />
        </Grid.Column>
        <Grid.Column width={6}>
          <Header dividing>Configuration</Header>
          <TickerCard ticker={ticker} />
          {twitter_enabled && (
            <>
              <Header dividing>Twitter</Header>
              <TwitterCard ticker={ticker} />
            </>
          )}

          {telegram_enabled && (
            <>
              <Header dividing>Telegram</Header>
              <TelegramCard ticker={ticker} />
            </>
          )}
          {user?.roles.includes('admin') && (
            <React.Fragment>
              <Header dividing>Users</Header>
              <TickerUsersCard ticker={ticker} />
              <Header dividing>Danger Zone</Header>
              <TickerResetModal
                ticker={ticker}
                trigger={
                  <Button
                    content="Reset"
                    icon="remove"
                    labelPosition="left"
                    negative
                    size="tiny"
                  />
                }
              />
            </React.Fragment>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Ticker
