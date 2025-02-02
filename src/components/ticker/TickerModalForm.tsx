import Campaign from '@mui/icons-material/Campaign'
import Tune from '@mui/icons-material/Tune'
import { Tab, Tabs } from '@mui/material'
import React, { FC, useState } from 'react'
import { Ticker } from '../../api/Ticker'
import Modal from '../common/Modal'
import TabPanel from '../common/TabPanel'
import TickerForm from './form/TickerForm'
import TickerIntegrations from './TickerIntegrations'

interface Props {
  onClose: () => void
  open: boolean
  ticker?: Ticker
}

const TickerModalForm: FC<Props> = ({ onClose, open, ticker }) => {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [tabValue, setTabValue] = useState<number>(0)

  const handleTabChange = (_: React.SyntheticEvent, value: number) => {
    setTabValue(value)
  }

  return (
    <Modal
      fullWidth
      onClose={onClose}
      open={open}
      submitForm={tabValue === 0 ? 'tickerForm' : undefined}
      title={ticker ? 'Configure Ticker' : 'Create Ticker'}
      submitting={submitting}
    >
      <Tabs onChange={handleTabChange} value={tabValue}>
        <Tab icon={<Tune />} iconPosition="start" label="General" />
        <Tab disabled={!ticker} icon={<Campaign />} iconPosition="start" label="Integrations" />
      </Tabs>
      <TabPanel index={0} value={tabValue}>
        <TickerForm callback={onClose} id="tickerForm" ticker={ticker} setSubmitting={setSubmitting} />
      </TabPanel>
      {ticker ? (
        <TabPanel index={1} value={tabValue}>
          <TickerIntegrations ticker={ticker} />
        </TabPanel>
      ) : null}
    </Modal>
  )
}

export default TickerModalForm
