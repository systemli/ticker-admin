import React, { FC, useCallback } from 'react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
import { useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material'
import { Close } from '@mui/icons-material'

interface Props {
  onClose: () => void
  open: boolean
  ticker: Ticker
}

const TickerResetModal: FC<Props> = ({ onClose, open, ticker }) => {
  const { token } = useAuth()
  const { putTickerReset } = useTickerApi(token)
  const queryClient = useQueryClient()

  const handleClose = () => {
    onClose()
  }

  const handleReset = useCallback(() => {
    putTickerReset(ticker)
      .then(() => {
        queryClient.invalidateQueries(['messages', ticker.id])
        queryClient.invalidateQueries(['tickerUsers', ticker.id])
        queryClient.invalidateQueries(['ticker', ticker.id])
      })
      .finally(() => {
        onClose()
      })
  }, [onClose, putTickerReset, queryClient, ticker])

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          Reset Ticker
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <p>
          <strong>Are you sure you want to reset the ticker?</strong>
        </p>
        <p>
          This will remove all messages, descriptions, the connection to twitter
          and disable the ticker.
        </p>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleReset} variant="contained">
          Reset
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TickerResetModal
