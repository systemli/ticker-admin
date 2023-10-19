import { Tab, Tabs } from '@mui/material'
import React, { FC, useState } from 'react'
import { Ticker } from '../../api/Ticker'
import TabPanel from '../common/TabPanel'
import TickerForm from './TickerForm'
import TickerSocialConnections from './TickerSocialConnections'
import Modal from '../common/Modal'

interface Props {
  onClose: () => void
  open: boolean
  ticker?: Ticker
}

const TickerModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const [tabValue, setTabValue] = useState<number>(0)

  const handleTabChange = (e: React.SyntheticEvent, value: number) => {
    setTabValue(value)
  }

  return (
    <Modal fullWidth onClose={onClose} open={open} submitForm={tabValue === 0 ? 'tickerForm' : undefined} title={ticker ? 'Configure Ticker' : 'Create Ticker'}>
      <Tabs onChange={handleTabChange} value={tabValue}>
        <Tab label="General" />
        <Tab disabled={!ticker} label="Social Connections" />
      </Tabs>
      <TabPanel index={0} value={tabValue}>
        <TickerForm callback={onClose} id="tickerForm" ticker={ticker} />
      </TabPanel>
      {ticker ? (
        <TabPanel index={1} value={tabValue}>
          <TickerSocialConnections ticker={ticker} />
        </TabPanel>
      ) : null}
    </Modal>
  )
}

export default TickerModalForm
