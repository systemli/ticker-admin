import { faCircleInfo, faGlobeEurope, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Campaign, Check, Pause } from '@mui/icons-material'
import { Card, CardContent, Chip, Divider, Link, Stack, Tooltip, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { FC, ReactNode } from 'react'
import { Ticker } from '../../api/Ticker'
import CopyToClipboard from '../common/CopyToClipboard'

interface Props {
  ticker: Ticker
}

const TickerCard: FC<Props> = ({ ticker }) => {
  const icon = ticker.active ? <Check /> : <Pause />
  const status = `Status: ${ticker.active ? 'Active' : 'Inactive'}`
  const color = ticker.active ? 'primary' : 'warning'

  const hasIntegrations =
    ticker.websites.length > 0 ||
    ticker.mastodon.connected ||
    ticker.telegram.connected ||
    ticker.bluesky.connected ||
    ticker.signalGroup.connected ||
    ticker.matrix.connected

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
          <FontAwesomeIcon icon={faCircleInfo} />
          <Typography component="h5" variant="h5" flexGrow={1}>
            Info
          </Typography>
        </Stack>
        <Stack sx={{ mt: 2 }}>
          <Typography variant="overline">Title</Typography>
          <Typography variant="body1">{ticker.title}</Typography>
        </Stack>
        <Chip icon={icon} label={status} variant="outlined" sx={{ mt: 2 }} size="small" color={color} />
        <Divider sx={{ mt: 2 }} />
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
          <Campaign />
          <Typography component="h6" variant="h6">
            Integrations
          </Typography>
        </Stack>
        {hasIntegrations ? <Integrations ticker={ticker} /> : <Chip label="No integrations" variant="outlined" sx={{ mt: 2 }} size="small" />}
      </CardContent>
    </Card>
  )
}

const Integrations = ({ ticker }: { ticker: Ticker }) => {
  return (
    <Stack>
      {ticker.websites.length > 0 && (
        <TickerProperty
          label="Websites"
          value={ticker.websites.map(website => (
            <Stack key={website.origin} direction="row" alignItems="center" spacing={0.5}>
              <FontAwesomeIcon icon={faGlobeEurope} color={grey[800]} />
              <Typography variant="body2" flexGrow={1}>
                <Link href={website.origin} target="_blank">
                  {website.origin.replace(/(^\w+:|^)\/\//, '')}
                </Link>
              </Typography>
              <CopyToClipboard text={website.origin} />
            </Stack>
          ))}
        />
      )}
      {ticker.mastodon.connected && (
        <TickerProperty
          label="Mastodon"
          value={
            <IntegrationChip
              active={ticker.mastodon.active}
              title={`${ticker.mastodon.server.replace(/https?:\/\//, '')}/@${ticker.mastodon.name}`}
              link={`${ticker.mastodon.server}/@${ticker.mastodon.name}`}
            />
          }
        />
      )}
      {ticker.telegram.connected && (
        <TickerProperty
          label="Telegram"
          value={
            <IntegrationChip
              active={ticker.telegram.active}
              title={ticker.telegram.channelName}
              link={`https://t.me/${ticker.telegram.channelName.substring(1)}`}
            />
          }
        />
      )}
      {ticker.bluesky.connected && (
        <TickerProperty
          label="Bluesky"
          value={<IntegrationChip active={ticker.bluesky.active} title={ticker.bluesky.handle} link={`https://bsky.app/profile/${ticker.bluesky.handle}`} />}
        />
      )}
      {ticker.signalGroup.connected && (
        <TickerProperty
          label="Signal Group"
          value={<IntegrationChip active={ticker.signalGroup.active} title="Signal Group" link={ticker.signalGroup.groupInviteLink} />}
        />
      )}
      {ticker.matrix.connected && (
        <TickerProperty
          label="Matrix"
          value={<IntegrationChip active={ticker.matrix.active} title={ticker.matrix.roomName} link={`https://matrix.to/#/${ticker.matrix.roomName}`} />}
        />
      )}
    </Stack>
  )
}

const TickerProperty = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <Stack sx={{ mt: 2 }}>
      <Typography variant="overline">{label}</Typography>
      {value}
    </Stack>
  )
}

const IntegrationChip = ({ active, title, link }: { active: boolean; title: string; link: string }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Tooltip title={active ? 'Active' : 'Inactive'} arrow placement="top">
        <FontAwesomeIcon icon={active ? faToggleOn : faToggleOff} color={grey[800]} />
      </Tooltip>
      <Typography variant="body2" flexGrow={1}>
        <Link href={link} target="_blank">
          {title}
        </Link>
      </Typography>
      <CopyToClipboard text={link} />
    </Stack>
  )
}

export default TickerCard
