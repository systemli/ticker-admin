import { faBluesky } from '@fortawesome/free-brands-svg-icons'
import { Link, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { Ticker, deleteTickerBlueskyApi, putTickerBlueskyApi } from '../../api/Ticker'
import useIntegrationActions from '../../hooks/useIntegrationActions'
import CopyToClipboard from '../common/CopyToClipboard'
import BlueskyForm from './BlueskyForm'
import IntegrationCard, { IntegrationStatus } from './IntegrationCard'
import IntegrationModalForm from './IntegrationModalForm'

interface Props {
  ticker: Ticker
}

const BlueskyCard: FC<Props> = ({ ticker }) => {
  const [open, setOpen] = useState(false)

  const bluesky = ticker.bluesky

  const { handleDelete, handleToggle, t } = useIntegrationActions({
    ticker,
    i18nPrefix: 'integrations.bluesky',
    deleteApi: deleteTickerBlueskyApi,
    toggleApi: putTickerBlueskyApi,
    active: bluesky.active,
  })

  const profileUrl = 'https://bsky.app/profile/' + bluesky.handle

  const replyRestrictionLabel = (restriction: string): string => {
    switch (restriction) {
      case 'followers':
        return t('integrations.bluesky.replyRestrictionFollowers')
      case 'following':
        return t('integrations.bluesky.replyRestrictionFollowing')
      case 'mentioned':
        return t('integrations.bluesky.replyRestrictionMentioned')
      case 'nobody':
        return t('integrations.bluesky.replyRestrictionNobody')
      default:
        return t('integrations.bluesky.replyRestrictionAnyone')
    }
  }

  const status: IntegrationStatus = bluesky.connected ? (bluesky.active ? 'active' : 'inactive') : 'notConfigured'

  const details = bluesky.connected ? (
    <Stack spacing={1}>
      <div>
        <Typography variant="caption" color="text.secondary">
          {t('integrations.profile')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link href={profileUrl} rel="noreferrer" target="_blank" variant="body2">
            {bluesky.handle}
          </Link>
          <CopyToClipboard text={profileUrl} />
        </Stack>
      </div>
      <div>
        <Typography variant="caption" color="text.secondary">
          {t('integrations.bluesky.replyRestriction')}
        </Typography>
        <Typography variant="body2">{replyRestrictionLabel(bluesky.replyRestriction)}</Typography>
      </div>
    </Stack>
  ) : null

  return (
    <IntegrationCard
      icon={faBluesky}
      title="Bluesky"
      description={t('integrations.bluesky.description')}
      status={status}
      details={details}
      connected={bluesky.connected}
      active={bluesky.active}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onConfigure={() => setOpen(true)}
    >
      <IntegrationModalForm
        open={open}
        onClose={() => setOpen(false)}
        ticker={ticker}
        formId="configureBluesky"
        titleKey="integrations.bluesky.configure"
        FormComponent={BlueskyForm}
      />
    </IntegrationCard>
  )
}

export default BlueskyCard
