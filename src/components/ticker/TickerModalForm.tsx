import { Close } from '@mui/icons-material'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
} from '@mui/material'
import React, { FC, useState } from 'react'
import { Ticker } from '../../api/Ticker'
import TabPanel from '../common/TabPanel'
import TickerForm from './TickerForm'
import TickerSocialConnections from './TickerSocialConnections'

interface Props {
  onClose: () => void
  open: boolean
  ticker?: Ticker
}

const TickerModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const [tabValue, setTabValue] = useState<number>(0)

  const handleClose = () => {
    onClose()
  }

  const handleTabChange = (e: React.SyntheticEvent, value: number) => {
    setTabValue(value)
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open}>
      <DialogTitle>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          {ticker ? 'Configure Ticker' : 'Create Ticker'}
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Tabs onChange={handleTabChange} value={tabValue}>
          <Tab label="General" />
          <Tab label="Social Connections" />
        </Tabs>
        <TabPanel index={0} value={tabValue}>
          <TickerForm callback={handleClose} id="tickerForm" ticker={ticker} />
        </TabPanel>
        {ticker ? (
          <TabPanel index={1} value={tabValue}>
            <TickerSocialConnections ticker={ticker} />
          </TabPanel>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default TickerModalForm
