import React, { FC, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Ticker, useTickerApi } from '../../api/Ticker'
import useAuth from '../useAuth'
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

const TickerModalDelete: FC<Props> = ({ open, onClose, ticker }) => {
  const { token } = useAuth()
  const { deleteTicker } = useTickerApi(token)
  const queryClient = useQueryClient()

  const handleClose = () => {
    onClose()
  }

  const handleDelete = useCallback(() => {
    deleteTicker(ticker).finally(() => {
      queryClient.invalidateQueries(['tickers'])
    })
  }, [deleteTicker, ticker, queryClient])

  return (
    <Dialog maxWidth="md" open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          Delete Ticker
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        Are you sure to delete the ticker? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleDelete} variant="contained">
          Delete
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TickerModalDelete
