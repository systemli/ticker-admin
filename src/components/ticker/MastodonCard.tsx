import { faMastodon } from '@fortawesome/free-brands-svg-icons'
import { Link, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { Ticker, deleteTickerMastodonApi, putTickerMastodonApi } from '../../api/Ticker'
import useIntegrationActions from '../../hooks/useIntegrationActions'
import CopyToClipboard from '../common/CopyToClipboard'
import IntegrationCard, { IntegrationStatus } from './IntegrationCard'
import IntegrationModalForm from './IntegrationModalForm'
import MastodonForm from './MastodonForm'

interface Props {
  ticker: Ticker
}

const MastodonCard: FC<Props> = ({ ticker }) => {
  const [open, setOpen] = useState(false)

  const mastodon = ticker.mastodon

  const { handleDelete, handleToggle, t } = useIntegrationActions({
    ticker,
    i18nPrefix: 'integrations.mastodon',
    deleteApi: deleteTickerMastodonApi,
    toggleApi: putTickerMastodonApi,
    active: mastodon.active,
  })

  const profileUrl = mastodon.server + '/web/@' + mastodon.name
  const profileHandle = `@${mastodon.name}@${mastodon.server.replace(/^https?:\/\//, '')}`

  const status: IntegrationStatus = mastodon.connected ? (mastodon.active ? 'active' : 'inactive') : 'notConfigured'

  const details = mastodon.connected ? (
    <Stack spacing={1}>
      <div>
        <Typography variant="caption" color="text.secondary">
          {t('integrations.profile')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link href={profileUrl} rel="noreferrer" target="_blank" variant="body2">
            {profileHandle}
          </Link>
          <CopyToClipboard text={profileUrl} />
        </Stack>
      </div>
    </Stack>
  ) : null

  return (
    <IntegrationCard
      icon={faMastodon}
      title="Mastodon"
      description={t('integrations.mastodon.description')}
      status={status}
      details={details}
      connected={mastodon.connected}
      active={mastodon.active}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onConfigure={() => setOpen(true)}
    >
      <IntegrationModalForm
        open={open}
        onClose={() => setOpen(false)}
        ticker={ticker}
        formId="configureMastodon"
        titleKey="integrations.mastodon.configure"
        FormComponent={MastodonForm}
      />
    </IntegrationCard>
  )
}

export default MastodonCard
