import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { Link, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { Ticker, deleteTickerWebsitesApi } from '../../api/Ticker'
import useIntegrationActions from '../../hooks/useIntegrationActions'
import IntegrationCard, { IntegrationStatus } from './IntegrationCard'
import IntegrationModalForm from './IntegrationModalForm'
import WebsiteForm from './WebsiteForm'

interface Props {
  ticker: Ticker
}

const WebsiteCard: FC<Props> = ({ ticker }) => {
  const [open, setOpen] = useState(false)

  const websites = ticker.websites
  const isConfigured = websites.length > 0

  const { handleDelete, t } = useIntegrationActions({
    ticker,
    i18nPrefix: 'integrations.website',
    deleteApi: deleteTickerWebsitesApi,
  })

  const status: IntegrationStatus = isConfigured ? 'configured' : 'notConfigured'

  const details = isConfigured ? (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {t('integrations.website.allowed')}
      </Typography>
      {websites.map(website => (
        <Link href={website.origin} rel="noreferrer" target="_blank" variant="body2" key={website.id}>
          {website.origin}
        </Link>
      ))}
    </Stack>
  ) : null

  return (
    <IntegrationCard
      icon={faGlobe}
      title="Websites"
      description={t('integrations.website.description')}
      status={status}
      details={details}
      connected={isConfigured}
      onDelete={handleDelete}
      onConfigure={() => setOpen(true)}
    >
      <IntegrationModalForm
        open={open}
        onClose={() => setOpen(false)}
        ticker={ticker}
        formId="configureWebsites"
        titleKey="integrations.website.configure"
        FormComponent={WebsiteForm}
      />
    </IntegrationCard>
  )
}

export default WebsiteCard
