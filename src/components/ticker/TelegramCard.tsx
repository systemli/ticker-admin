import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faBan, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import React, { FC, useCallback, useState } from 'react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import TelegramModalForm from './TelegramModalForm'

interface Props {
  ticker: Ticker
}

const TelegramCard: FC<Props> = ({ ticker }) => {
  const { token } = useAuth()
  const { deleteTickerTelegram, putTickerTelegram } = useTickerApi(token)
  const [open, setOpen] = useState<boolean>(false)
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

  return (
    <Card>
      <CardContent>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Typography component="h5" variant="h5">
            <FontAwesomeIcon icon={faTelegram} /> Telegram
          </Typography>
          <Button onClick={() => setOpen(true)} size="small" variant="outlined">
            Configure
          </Button>
        </Stack>
        {telegram.connected ? (
          <Box>
            <Typography variant="body2">
              You are connected to Telegram.
            </Typography>
            <Typography variant="body2">
              Your Channel: {telegram.channel_name}
            </Typography>
            <Typography variant="body2">
              Bot: {telegram.bot_username}
            </Typography>
          </Box>
        ) : (
          <>
            You are currently not connected to Telegram. New messages will not
            be published to your channel and old messages can not be deleted
            anymore.
          </>
        )}
      </CardContent>
      {telegram.connected ? (
        <CardActions>
          {telegram.active ? (
            <Button
              onClick={handleToggle}
              startIcon={<FontAwesomeIcon icon={faPause} />}
            >
              Disable
            </Button>
          ) : (
            <Button
              onClick={handleToggle}
              startIcon={<FontAwesomeIcon icon={faPlay} />}
            >
              Enable
            </Button>
          )}
          <Button
            onClick={handleDisconnect}
            startIcon={<FontAwesomeIcon icon={faBan} />}
          >
            Disconnect
          </Button>
        </CardActions>
      ) : null}
      <TelegramModalForm
        onClose={() => setOpen(false)}
        open={open}
        ticker={ticker}
      />
    </Card>
  )
}

export default TelegramCard
