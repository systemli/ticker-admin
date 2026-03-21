import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, Stack, Tooltip, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { Ticker, deleteTickerTelegramApi, putTickerTelegramApi } from '../../api/Ticker'
import useIntegrationActions from '../../hooks/useIntegrationActions'
import CopyToClipboard from '../common/CopyToClipboard'
import IntegrationCard, { IntegrationStatus } from './IntegrationCard'
import IntegrationModalForm from './IntegrationModalForm'
import TelegramForm from './TelegramForm'

interface Props {
  ticker: Ticker
}

const TelegramCard: FC<Props> = ({ ticker }) => {
  const [open, setOpen] = useState(false)

  const telegram = ticker.telegram

  const { handleDelete, handleToggle, t } = useIntegrationActions({
    ticker,
    i18nPrefix: 'integrations.telegram',
    deleteApi: deleteTickerTelegramApi,
    toggleApi: putTickerTelegramApi,
    active: telegram.active,
  })

  const channelUrl = `https://t.me/${telegram.channelName}`

  const status: IntegrationStatus = telegram.connected ? (telegram.active ? 'active' : 'inactive') : 'notConfigured'

  const details = telegram.connected ? (
    <Stack spacing={1}>
      <div>
        <Typography variant="caption" color="text.secondary">
          {t('integrations.telegram.channel')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link href={channelUrl} rel="noreferrer" target="_blank" variant="body2">
            {telegram.channelName}
          </Link>
          <CopyToClipboard text={channelUrl} />
        </Stack>
      </div>
      <div>
        <Typography variant="caption" color="text.secondary">
          {t('integrations.telegram.botLabel')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2">{telegram.botUsername}</Typography>
          <Tooltip title={t('integrations.telegram.botHint')}>
            <FontAwesomeIcon icon={faCircleInfo} size="sm" style={{ color: 'gray', cursor: 'help' }} />
          </Tooltip>
        </Stack>
      </div>
    </Stack>
  ) : null

  return (
    <IntegrationCard
      icon={faTelegram}
      title={t('integrations.telegram.title')}
      description={t('integrations.telegram.description')}
      status={status}
      details={details}
      connected={telegram.connected}
      active={telegram.active}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onConfigure={() => setOpen(true)}
    >
      <IntegrationModalForm
        open={open}
        onClose={() => setOpen(false)}
        ticker={ticker}
        formId="configureTelegram"
        titleKey="integrations.telegram.configure"
        FormComponent={TelegramForm}
      />
    </IntegrationCard>
  )
}

export default TelegramCard
