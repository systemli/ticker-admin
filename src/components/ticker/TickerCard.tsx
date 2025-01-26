import { faCheck, faHeading, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { FC } from 'react'
import { Ticker } from '../../api/Ticker'
import NamedListItem from '../common/NamedListItem'
import SocialConnectionChip from './SocialConnectionChip'

interface Props {
  ticker: Ticker
}

const TickerCard: FC<Props> = ({ ticker }) => {
  return (
    <Card>
      <CardContent>
        <NamedListItem title="Title">
          <Typography>
            <FontAwesomeIcon color="GrayText" icon={faHeading} style={{ width: 16, paddingRight: 2 }} />
            {ticker.title}
          </Typography>
        </NamedListItem>
        <NamedListItem title="Status">
          <Typography>
            <FontAwesomeIcon color="GrayText" icon={ticker.active ? faCheck : faXmark} style={{ width: 16, paddingRight: 2 }} />
            {ticker.active ? 'Active' : 'Inactive'}
          </Typography>
        </NamedListItem>
        <NamedListItem title="Integrations">
          <Box>
            <SocialConnectionChip active={ticker.websites.length > 0} label="Website" />
            <SocialConnectionChip active={ticker.mastodon.active} label="Mastodon" />
            <SocialConnectionChip active={ticker.telegram.active} label="Telegram" />
            <SocialConnectionChip active={ticker.bluesky.active} label="Bluesky" />
            <SocialConnectionChip active={ticker.signalGroup.active} label="Signal" />
          </Box>
        </NamedListItem>
      </CardContent>
    </Card>
  )
}

export default TickerCard
