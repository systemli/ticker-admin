import Campaign from '@mui/icons-material/Campaign'
import Tune from '@mui/icons-material/Tune'
import { Tab, Tabs } from '@mui/material'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
      title={t(ticker ? 'tickers.configure' : 'tickers.create')}
      submitting={submitting}
    >
      <Tabs onChange={handleTabChange} value={tabValue}>
        <Tab icon={<Tune />} iconPosition="start" label={t('common.general')} />
        <Tab disabled={!ticker} icon={<Campaign />} iconPosition="start" label={t('title.integrations')} />
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
