import { FC } from 'react'
import { Box, Card, CardContent, Link, Typography } from '@mui/material'
import { Ticker } from '../../api/Ticker'
import NamedListItem from '../common/NamedListItem'
import SocialConnectionChip from './SocialConnectionChip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faHeading, faLink, faXmark } from '@fortawesome/free-solid-svg-icons'

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
        <NamedListItem title="Domain">
          <Typography>
            <FontAwesomeIcon color="GrayText" icon={faLink} style={{ width: 16, paddingRight: 2 }} />
            <Link href={'https://' + ticker.domain} rel="noreferrer" target="_blank">
              {ticker.domain}
            </Link>
          </Typography>
        </NamedListItem>
        <NamedListItem title="Social Connections">
          <Box>
            <SocialConnectionChip active={ticker.mastodon.active} label="Mastodon" />
            <SocialConnectionChip active={ticker.telegram.active} label="Telegram" />
          </Box>
        </NamedListItem>
      </CardContent>
    </Card>
  )
}

export default TickerCard
